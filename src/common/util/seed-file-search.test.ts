import { Blob, File } from "buffer";
import { readFileSync } from "fs";
import type { AsyncReturnType } from "type-fest";
import { expect, test } from "vitest";
import { MtRand } from "~/common/util/mt-rand";
import {
  readSeedFileHeader,
  searchSeedFileForSequence,
  type ByteSource,
  type EOF,
} from "~/common/util/seed-file-search";

const TEST_FILES_BASE = new URL(
  "../../assets/test/seed-file-search/",
  import.meta.url,
);

class MockByteSource implements ByteSource {
  readonly #buffers: ArrayBuffer[];
  #chunkNum = 0;
  #buffer: Uint8Array = new Uint8Array();
  #position = 0;
  #done = false;

  constructor(buffers: ArrayBuffer[]) {
    this.#buffers = buffers;
  }

  getNextByte(): number | EOF {
    if (this.#done) {
      return "EOF";
    }

    if (this.#position >= this.#buffer.length) {
      const nextBuf = this.#buffers[this.#chunkNum] ?? new ArrayBuffer();

      if (nextBuf.byteLength <= 0) {
        this.#done = true;
        return "EOF";
      }

      this.#chunkNum++;
      this.#buffer = new Uint8Array(nextBuf);
      this.#position = 0;
    }

    return this.#buffer[this.#position++];
  }
}

function getFile(fileName: string): File {
  return new File(
    [new Blob([readFileSync(new URL(fileName, TEST_FILES_BASE))])],
    fileName,
  );
}

test.each<{
  fileName: string;
  result: AsyncReturnType<typeof readSeedFileHeader>;
}>([
  {
    fileName: "seeds.bin",
    result: {
      type: "result",
      value: {
        startSeed: 0x10cefa80,
        stopSeed: 0x10ed7f00,
        state: 335,
      },
    },
  },
  {
    fileName: "seeds-bad-magic.bin",
    result: { type: "error", error: "badMagic" },
  },
  {
    fileName: "seeds-old.bin",
    result: { type: "error", error: "oldMagic" },
  },
  {
    fileName: "seeds-premature-eof-in-header.bin",
    result: { type: "error", error: "prematureEof" },
  },
])(
  "readSeedFileHeader($fileName) returns $result",
  async ({ fileName, result }) => {
    expect(await readSeedFileHeader(getFile(fileName))).toEqual(result);
  },
);

test.each<{
  fileName: string;
  sequence: number[];
  result: ReturnType<typeof searchSeedFileForSequence>;
}>([
  {
    fileName: "seeds.bin",
    sequence: [1, 5, 6, 6, 3, 2, 0, 0, 3, 6, 5, 1, 0, 4],
    result: {
      type: "result",
      value: (() => {
        const rng = new MtRand(0x10dbf141);
        rng.goTo(349);
        return rng;
      })(),
    },
  },
  {
    fileName: "seeds-bad-magic.bin",
    sequence: [0, 0, 0, 0, 0, 0, 0, 0],
    result: { type: "error", error: "badMagic" },
  },
  {
    fileName: "seeds-old.bin",
    sequence: [0, 0, 0, 0, 0, 0, 0, 0],
    result: { type: "error", error: "oldMagic" },
  },
  {
    fileName: "seeds-premature-eof-in-header.bin",
    sequence: [0, 0, 0, 0, 0, 0, 0, 0],
    result: { type: "error", error: "prematureEof" },
  },
  {
    fileName: "seeds-premature-eof-in-values.bin",
    sequence: [0, 0, 0, 0, 0, 0, 0, 0],
    result: { type: "error", error: "prematureEof" },
  },
  {
    fileName: "seeds.bin",
    sequence: [0, 0, 0, 0, 0, 0, 0],
    result: { type: "error", error: "insufficientTarget" },
  },
  {
    fileName: "seeds.bin",
    sequence: [0, 0, 0, 0, 0, 0, 0, 0],
    result: { type: "result", value: null },
  },
])(
  "searchSeedFileForSequence($fileName, $sequence) returns $result",
  async ({ fileName, sequence, result }) => {
    const file = getFile(fileName);

    let chunkNum = 0;
    const chunkSize = 2 ** 16;
    const buffers: ArrayBuffer[] = [];
    while (true) {
      const buffer = await file
        .slice(chunkNum * chunkSize, (chunkNum + 1) * chunkSize)
        .arrayBuffer();
      if (buffer.byteLength <= 0) {
        break;
      }

      buffers.push(buffer);
      chunkNum++;
    }

    expect(
      searchSeedFileForSequence(new MockByteSource(buffers), sequence),
    ).toEqual(result);
  },
);

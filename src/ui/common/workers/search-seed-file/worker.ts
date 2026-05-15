import {
  searchSeedFileForSequence,
  type ByteSource,
  type EOF,
} from "~/common/util/seed-file-search";
import type { SearchSeedFileWorker } from "~/ui/common/workers/search-seed-file/search-seed-file.types";
import type {
  CommandType,
  ResultSubtype,
} from "~/ui/common/workers/workers.types";

const FILE_CHUNK_SIZE = 2 ** 24;

class FileReaderSyncByteSource implements ByteSource {
  readonly #file: File;
  readonly #reader = new FileReaderSync();
  #chunkNum = 0;
  #buffer: Uint8Array = new Uint8Array();
  #position = 0;
  #done = false;

  constructor(file: File) {
    this.#file = file;
  }

  getNextByte(): number | EOF {
    if (this.#done) {
      return "EOF";
    }

    if (this.#position >= this.#buffer.length) {
      const nextBuf = this.#reader.readAsArrayBuffer(
        this.#file.slice(
          this.#chunkNum * FILE_CHUNK_SIZE,
          (this.#chunkNum + 1) * FILE_CHUNK_SIZE,
        ),
      );

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

onmessage = ({
  data,
}: MessageEvent<CommandType<SearchSeedFileWorker>>): void => {
  const result = searchSeedFileForSequence(
    new FileReaderSyncByteSource(data.seedFile),
    data.targetSequence,
  );

  postMessage({
    type: "terminalResult",
    result:
      result.type === "result" && result.value !== null
        ? result.value.deconstruct()
        : null,
  } satisfies ResultSubtype<SearchSeedFileWorker, "terminalResult">);
};

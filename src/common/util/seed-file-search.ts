import type { ExcludeStrict } from "type-fest";
import { MtRand } from "~/common/util/mt-rand";

export type EOF = "EOF";

export interface ByteSource {
  getNextByte: () => number | EOF;
}

class ByteReader {
  readonly #byteSource: ByteSource;
  #done = false;

  constructor(byteSource: ByteSource) {
    this.#byteSource = byteSource;
  }

  getNextBytes(numBytes: number): number[] | EOF {
    if (this.#done) {
      return "EOF";
    }

    const bytes = new Array<number>(numBytes);
    for (let i = 0; i < bytes.length; i++) {
      const value = this.#byteSource.getNextByte();
      if (value === "EOF") {
        this.#done = true;
        return value;
      }

      bytes[i] = value;
    }

    return bytes;
  }

  getNextInteger(numBytes: 1 | 2 | 3 | 4): number | EOF {
    if (this.#done) {
      return "EOF";
    }

    const bytes = this.getNextBytes(numBytes);
    if (bytes === "EOF") {
      return bytes;
    }

    let integer = 0;
    for (let i = 0; i < bytes.length; i++) {
      integer |= bytes[i] << ((bytes.length - i - 1) * 8);
    }

    return integer >>> 0;
  }
}

type ErrorType =
  | "prematureEof"
  | "badMagic"
  | "oldMagic"
  | "insufficientTarget";

class EofError extends Error {}

function handleEof<T>(maybeEof: T | EOF): T {
  if (maybeEof === "EOF") {
    throw new EofError();
  }

  return maybeEof;
}

/**
 * Reads the header from an XCXWW Pre-Computed Seed File (v2).
 *
 * @param file The seed file
 * @returns Information from the file header, or an error string if an error
 *   occured
 */
export async function readSeedFileHeader(file: File): Promise<
  | {
      type: "result";
      value: { startSeed: number; stopSeed: number; state: number };
    }
  | { type: "error"; error: ExcludeStrict<ErrorType, "insufficientTarget"> }
> {
  const headerBuf = await file.slice(0, 16).arrayBuffer();
  if (headerBuf.byteLength < 16) {
    return { type: "error", error: "prematureEof" };
  }

  const magic = new TextDecoder("us-ascii").decode(
    new Uint8Array(headerBuf.slice(0, 4)),
  );
  if (magic === "SEED") {
    return { type: "error", error: "oldMagic" };
  } else if (magic !== "SEE2") {
    return { type: "error", error: "badMagic" };
  }

  const header = new DataView(headerBuf);
  const startSeed = header.getUint32(4, false);
  const stopSeed = header.getUint32(8, false);
  const state = header.getUint32(12, false);

  return { type: "result", value: { startSeed, stopSeed, state } };
}

/**
 * Searches an XCXWW Pre-Computed Seed File (v2) for a seed given a target
 * sequence.
 *
 * The target sequence must have at least 8 elements.
 *
 * @param fileByteSource The seed file byte source
 * @param targetSequence The target sequence
 * @returns An MtRand constructed from the found seed and current state, or an
 *   error string if an error occured, or null if the file was completely
 *   searched without success or error
 */
export function searchSeedFileForSequence(
  fileByteSource: ByteSource,
  targetSequence: number[],
):
  | { type: "result"; value: MtRand | null }
  | { type: "error"; error: ErrorType } {
  if (targetSequence.length < 8) {
    return { type: "error", error: "insufficientTarget" };
  }

  const targetValue = targetSequence
    .slice(0, 8)
    .reduce((acc, value, i) => acc | (value << ((7 - i) * 3)), 0);

  const reader = new ByteReader(fileByteSource);

  try {
    const magic = new TextDecoder("us-ascii").decode(
      new Uint8Array(handleEof(reader.getNextBytes(4))),
    );
    if (magic === "SEED") {
      return { type: "error", error: "oldMagic" };
    } else if (magic !== "SEE2") {
      return { type: "error", error: "badMagic" };
    }

    let seed = handleEof(reader.getNextInteger(4));
    const stopSeed = handleEof(reader.getNextInteger(4));
    const state = handleEof(reader.getNextInteger(4));

    while (seed <= stopSeed) {
      const value = handleEof(reader.getNextInteger(3));
      if (value === targetValue) {
        const rng = new MtRand(seed);
        rng.goTo(state + 8);

        let isMatch = true;
        for (const voice of targetSequence.slice(8)) {
          if (voice !== rng.randIntPow2(3)) {
            isMatch = false;
            break;
          }
        }

        if (isMatch) {
          return { type: "result", value: rng };
        }
      }

      seed++;
    }
  } catch (e) {
    if (e instanceof EofError) {
      return { type: "error", error: "prematureEof" };
    }
  }

  return { type: "result", value: null };
}

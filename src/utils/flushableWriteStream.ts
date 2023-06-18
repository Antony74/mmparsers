import fs from 'fs';
import fsp from 'fs/promises';

// It's painful that fs doesn't export this
interface StreamOptions {
    flags?: string | undefined;
    encoding?: BufferEncoding | undefined;
    fd?: number | fsp.FileHandle | undefined;
    mode?: number | undefined;
    autoClose?: boolean | undefined;
    emitClose?: boolean | undefined;
    start?: number | undefined;
    highWaterMark?: number | undefined;
}

export interface FlushableWriteStream {
    write: (chunk: unknown) => void;
    flush: () => Promise<unknown>;
}

export const createFlushableWriteStream = (
    path: fs.PathLike,
    options?: BufferEncoding | StreamOptions
): FlushableWriteStream => {
    let outstandingWrites = 0;
    let written: (value?: unknown) => void;
    const writeStream = fs.createWriteStream(path, options);

    return {
        write: (chunk: unknown): void => {
            ++outstandingWrites;
            writeStream.write(chunk, () => {
                --outstandingWrites;
                if (outstandingWrites <= 0 && written) {
                    written();
                }
            });
        },
        flush: (): Promise<unknown> => {
            if (outstandingWrites <= 0) {
                return Promise.resolve();
            } else {
                return new Promise((resolve) => {
                    written = resolve;
                });
            }
        },
    };
};

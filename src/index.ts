import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { createMmParser } from './mmParser';
import { createStringJsonWriter } from './jsonWriter/stringJsonWriter';

const main = async (): Promise<void> => {
    const filepath = path.join(__dirname, '..', 'examples', 'demo0.mm');
    const parsedFilePath = path.parse(filepath);
    const filename = `${parsedFilePath.name}${parsedFilePath.ext}`;
    const text = await fsp.readFile(filepath, { encoding: 'utf-8' });
    const writeStream = fs.createWriteStream(`examples/${filename}.json`);
    let outstandingWrites = 0;
    let written: (value?: unknown) => void;
    const writer = createStringJsonWriter((s) => {
        ++outstandingWrites;
        writeStream.write(s, () => {
            --outstandingWrites;
            if (outstandingWrites <= 0 && written) {
                written();
            }
        });
    });

    const parser = createMmParser(writer);

    const parse = async (text: string): Promise<void> => {
        try {
            parser.feed(text);
            parser.finish();
        } catch (e) {
            if (outstandingWrites) {
                await new Promise((resolve) => {
                    written = resolve;
                });
            }
            throw e;
        }
        // await fs.writeFile(
        //     `examples/${filename}.json`,
        //     prettier.format(JSON.stringify(result), { parser: 'json' })
        // );

        // Any change to this file indicates a bad parse
        //        await fs.writeFile(`examples/${filename}`, reverseParse(result));
    };

    parse(text);
};

main();

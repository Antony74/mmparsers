import fsp from 'fs/promises';
import path from 'path';
import { createMmParser } from './mmParser';
import { createStringJsonWriter } from './jsonWriter/stringJsonWriter';
import { createFlushableWriteStream } from './utils/flushableWriteStream';

const main = async (): Promise<void> => {
    const filepath = path.join(__dirname, '..', 'examples', 'demo0.mm');
    const parsedFilePath = path.parse(filepath);
    const filename = `${parsedFilePath.name}${parsedFilePath.ext}`;
    const text = await fsp.readFile(filepath, { encoding: 'utf-8' });
    const writeStream = createFlushableWriteStream(`examples/${filename}.json`);
    const writer = createStringJsonWriter((s) => {
        writeStream.write(s);
    });

    const parser = createMmParser(writer);

    const parse = async (text: string): Promise<void> => {
        try {
            parser.feed(text);
            parser.finish();
        } catch (e) {
            await writeStream.flush();
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

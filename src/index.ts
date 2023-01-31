import fs from 'fs/promises';
import path from 'path';
import { reverseParse } from './tools/reverseParse';
import { Database } from './mmParser/mmParseTree';
import { createMmParser } from './mmParser';

const main = async (): Promise<void> => {
    const parser = createMmParser();

    const parse = async (text: string): Promise<Database> => {
        parser.feed(text);
        const result = parser.finish();

        await fs.writeFile(
            `examples/${filename}.json`,
            JSON.stringify(result, null, 4)
        );

        // Any change to this file indicates a bad parse
        // await fs.writeFile(`examples/${filename}`, reverseParse(result));

        return result;
    };

    const filepath = path.join(__dirname, '..', 'examples', 'demo0.mm');
    //    const filepath = '/set.mm/set.mm';
    const parsedFilePath = path.parse(filepath);
    const filename = `${parsedFilePath.name}${parsedFilePath.ext}`;
    const text = await fs.readFile(filepath, { encoding: 'utf-8' });

    parse(text);
};

main();

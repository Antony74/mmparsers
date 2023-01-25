import fs from 'fs/promises';
import path from 'path';
import nearley from 'nearley';
import { reverseParse } from './tools/reverseParse';
import { Database } from './mmParser/mmParseTree';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const grammar = require('./mmParser/mmParser');

const main = async (): Promise<void> => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const parse = async (text: string): Promise<Database> => {
        parser.feed(text);
        parser.finish();

        if (parser.results.length > 1) {
            await fs.writeFile(
                'ambiguous.json',
                JSON.stringify(parser.results, null, 4)
            );
            throw new Error('Ambiguous');
        } else if (parser.results.length < 1) {
            throw new Error('No results');
        }

        const result = parser.results[0];
        await fs.writeFile(
            `examples/${filename}.json`,
            JSON.stringify(result, null, 4)
        );

        // Any change to this file indicates a bad parse
        await fs.writeFile(`examples/${filename}`, reverseParse(result));

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

// Just for inspiration, let's see the parse tree Nearley generates from the mm parser spec

import fs from 'fs/promises';
import path from 'path';
import nearley from 'nearley';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const grammar = require('nearley/lib/nearley-language-bootstrapped');

const main = async () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const parse = async (text: string) => {
        parser.feed(text);
        parser.finish();

        if (parser.results.length > 1) {
            await fs.writeFile(
                'ambigious.json',
                JSON.stringify(parser.results, null, 4)
            );
            throw new Error('Ambigious');
        } else if (parser.results.length < 1) {
            throw new Error('No results');
        }

        const result = parser.results[0];
        await fs.writeFile(`${filename}.json`, JSON.stringify(result, null ,4))
        return result;
    };

    const filepath = path.join(__dirname, 'mmParser', 'mmParser.ne');
    const parsedFilePath = path.parse(filepath);
    const filename = `${parsedFilePath.name}${parsedFilePath.ext}`;
    const text = await fs.readFile(filepath, { encoding: 'utf-8' });

    parse(text);
};

main();

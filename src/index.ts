import fs from 'fs/promises';
import path from 'path';
import { lexer } from './mmParser/lexer';
import nearley from 'nearley';

const grammar = require('./mmParser/mmParser');

const main = async () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const lex = async (text: string) => {
        lexer.reset(text);

        let token: moo.Token | undefined;
        const tokens: moo.Token[] = [];

        while ((token = lexer.next())) {
            tokens.push(token);
        }

        await fs.writeFile(`${filename}.tokens.json`, JSON.stringify(tokens, null ,4))
        return tokens;
    };

    const parse = async (text: string) => {
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
        await fs.writeFile(`${filename}.json`, JSON.stringify(result, null ,4))
        return result;
    };

    const filepath = path.join(__dirname, '..', 'examples', 'demo0.mm');
    // const filepath = '/set.mm/set.mm';
    const parsedFilePath = path.parse(filepath);
    const filename = `${parsedFilePath.name}${parsedFilePath.ext}`;
    const text = await fs.readFile(filepath, { encoding: 'utf-8' });

    // Note the lexing is built into the parser, we only do both in order to capture the intermediate output
    lex(text);

    parse(text);
};

main();

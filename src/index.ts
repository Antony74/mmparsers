import fs from 'fs/promises';
import path from 'path';
import { lexer, mooLexerRules } from './mmParser/lexer';
import nearley from 'nearley';

const grammar = require('./mmParser/mmParser');

const main = async () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

    const lex = (text: string) => {
        // console.log(mooLexerRules);

        lexer.reset(text);

        let token: moo.Token | undefined;
        const tokens: moo.Token[] = [];

        while ((token = lexer.next())) {
            tokens.push(token);
        }

        console.log(tokens);
    };

    const parse = (text: string) => {
        parser.feed(text);

        if (parser.results.length > 1) {
            throw new Error('Ambigious');
        } else if (parser.results.length < 1) {
            throw new Error('No results');
        }

        console.log(JSON.stringify(parser.results[0], null, 4));
    };

    const filename = path.join(__dirname, '..', 'examples', 'demo0.mm');
    const text = await fs.readFile(filename, { encoding: 'utf-8' });

    lex(text);
};

main();

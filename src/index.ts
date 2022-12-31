import fs from 'fs/promises';
import path from 'path';
import nearley from 'nearley';
import { lexer } from './mmParser/lexer';

const grammar = require('./mmParser/mmParser');

const main = async () => {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), {
        lexer,
    });

    const filename = path.join(__dirname, '..', 'examples', 'demo0.mm');
    const text = await fs.readFile(filename, { encoding: 'utf-8' });

    parser.feed(text);

    if (parser.results.length > 1) {
        throw new Error('Ambigious');
    } else if (parser.results.length < 1) {
        throw new Error('No results');
    }

    console.log(JSON.stringify(parser.results[0], null, 4));
};

main();

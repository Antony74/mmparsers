/* eslint-disable no-cond-assign */
import fsp from 'fs/promises';
import path from 'path';

import { ebnfLexer } from './ebnf-to-json/ebnf-bootstrap-lexer';

const main = async (): Promise<void> => {
    const filename = path.join(__dirname, 'ebnf-to-json', 'ebnf.ebnf');
    const text = await fsp.readFile(filename, { encoding: 'utf-8' });
    ebnfLexer.reset(text);
    let token;
    while ((token = ebnfLexer.next())) {
        console.log(token.type);
    }
};

main();

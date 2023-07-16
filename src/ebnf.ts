/* eslint-disable no-cond-assign */
import fsp from 'fs/promises';
import path from 'path';

import { lexer } from './ebnf-to-json/ebnf-bootstrap-lexer';

const main = async (): Promise<void> => {
    const filename = path.join(__dirname, 'ebnf', 'ebnf.ebnf');
    const text = await fsp.readFile(filename, { encoding: 'utf-8' });
    lexer.reset(text);
    let token;
    while ((token = lexer.next())) {
        console.log(token);
    }
};

main();

import fs from 'fs/promises';
import path from 'path';
import { lexer } from './mmParser/lexer';

const main = async () => {
    const filename = path.join(__dirname, '..', 'examples', 'demo0.mm');
    const text = await fs.readFile(filename, { encoding: 'utf-8' });
    lexer.reset(text);

    let token: moo.Token | undefined;
    const tokens: moo.Token[] = [];
    while ((token = lexer.next())) {
        tokens.push(token);
    }

    console.log(tokens);
};

main();

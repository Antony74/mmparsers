import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const mmTexUrl =
    'https://raw.githubusercontent.com/metamath/metamath-book/master/metamath.tex';

const obtainBnfText = async (): Promise<string[]> => {
    const parserFilename = path.join(
        __dirname,
        '../../examples',
        'metamath-parser.bnf'
    );
    const lexerFilename = path.join(
        __dirname,
        '../../examples',
        'metamath-lexer.bnf'
    );

    const filenames = [parserFilename, lexerFilename];

    const [parserStat, lexerStat] = await Promise.all(
        filenames.map((filename) => {
            return fs.stat(filename).catch(() => undefined);
        })
    );

    if (parserStat && lexerStat) {
        return Promise.all(
            filenames.map((filename) =>
                fs.readFile(filename, { encoding: 'utf-8' })
            )
        );
    }

    const response = await fetch(mmTexUrl);
    const text = await response.text();

    console.log(text);

    return [text];
};

obtainBnfText();

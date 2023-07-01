import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const mmTexUrl =
    'https://raw.githubusercontent.com/metamath/metamath-book/master/metamath.tex';

const obtainBnfText = async (): Promise<string[]> => {
    const parserFilename = path.join(
        __dirname,
        '../../examples',
        'metamath-parser-original.ebnf'
    );
    const lexerFilename = path.join(
        __dirname,
        '../../examples',
        'metamath-lexer-original.ebnf'
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

    const verbatim = text
        .split('\\chapter{Metamath Language EBNF}%')
        .pop()!
        .split('\\begin{verbatim}')
        .slice(1, 3)
        .map((piece) => piece.trimStart().split('\\end{verbatim}').shift()!);

    filenames.forEach((filename, index) =>
        fs.writeFile(filename, verbatim[index])
    );

    return verbatim;
};

obtainBnfText();

import path from 'path';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const mmTexUrl =
    'https://raw.githubusercontent.com/metamath/metamath-book/master/metamath.tex';

const main = async (): Promise<string[]> => {
    const filename = path.join(__dirname, 'metamath.ebnf');

    const response = await fetch(mmTexUrl);
    const text = await response.text();

    const verbatim = text
        .split('\\chapter{Metamath Language EBNF}%')
        .pop()!
        .split('\\begin{verbatim}')
        .slice(1, 3)
        .map((piece) => piece.trimStart().split('\\end{verbatim}').shift()!);

    fs.writeFile(filename, verbatim.join(''));

    return verbatim;
};

main();

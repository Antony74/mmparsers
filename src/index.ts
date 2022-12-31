import fs from 'fs/promises';
import path from 'path';
import moo from 'moo';
import { RegexLiteral } from './fluent-regex/src';

const main = async () => {
    const openComment = new RegexLiteral('$(');
    const closeComment = /\$\)/;

    const mooLexerRules: moo.Rules = {
        wh: {
            match: RegexLiteral.anyWhitespace().onceOrMore().toRegex(),
            lineBreaks: true,
        },
        comment: {
            match: openComment.toRegex(),
            lineBreaks: true,
        },
    };

    const lexer = moo.compile(mooLexerRules);

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

// [^$\)]*

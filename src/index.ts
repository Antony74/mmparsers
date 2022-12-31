import fs from 'fs/promises';
import path from 'path';
import moo from 'moo';
import { RegexLiteral, RegexSequence } from './fluent-regex/src';
import Not from './fluent-regex/src/Not';

const main = async () => {
    const openComment = new RegexLiteral('$(');
    const closeComment = new RegexLiteral('$)');

    const mooLexerRules: moo.Rules = {
        wh: {
            match: RegexLiteral.anyWhitespace().onceOrMore().toRegex(),
            lineBreaks: true,
        },
        comment: {
            match: new RegexSequence(
                openComment,
                new Not(closeComment).zeroOrMore(),
                closeComment
            ).toRegex(),
            lineBreaks: true,
        },
    };

    console.log(mooLexerRules);

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

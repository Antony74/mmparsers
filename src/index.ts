import fsp from 'fs/promises';
import path from 'path';

import prettier from 'prettier';

import { createParser } from './fsm-to-json';
import { createStringJsonWriter } from './jsonWriter/stringJsonWriter';
import { createFlushableWriteStream } from './utils/flushableWriteStream';
import { ebnfMachineConfig } from './ebnf-to-json/ebnf-bootstrap-machine-config';
import { ebnfLexer } from './ebnf-to-json/ebnf-bootstrap-lexer';

const main = async (): Promise<void> => {
    const filepath = path.join(__dirname, 'ebnf', 'ebnf.ebnf');
    const parsedFilePath = path.parse(filepath);
    const filename = `${parsedFilePath.name}${parsedFilePath.ext}`;
    const text = await fsp.readFile(filepath, { encoding: 'utf-8' });
    const writeStream = createFlushableWriteStream(`examples/${filename}.json`);
    const writer = createStringJsonWriter((s) => {
        writeStream.write(s);
    });

    const parser = createParser(ebnfLexer, ebnfMachineConfig, writer);

    try {
        parser.feed(text);
        parser.finish();
    } catch (e) {
        await writeStream.flush();
        throw e;
    }

    await writeStream.flush();

    const result = await fsp.readFile(`examples/${filename}.json`, {
        encoding: 'utf-8',
    });

    await fsp.writeFile(
        `examples/${filename}.json`,
        prettier.format(result, { parser: 'json' }),
    );

    // Any change to this file indicates a bad parse
    //        await fs.writeFile(`examples/${filename}`, reverseParse(result));
};

main();

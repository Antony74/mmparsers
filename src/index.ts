import fs from 'fs';
import { createStringJsonWriter } from './jsonWriter/stringJsonWriter';

const main = async (): Promise<void> => {
    const writeStream = fs.createWriteStream('output.json');
    const jsonWriter = createStringJsonWriter((s) => writeStream.write(s));

    jsonWriter
        .beginObject()
        .name('Sherlock')
        .beginArray()
        .beginObject()
        .name('name')
        .value('Sherlock Holmes')
        .name('address')
        .beginArray()
        .value('221B Baker Street')
        .value('London')
        .close()
        .close()
        .close()
        .close();
};

main();

import fs from 'fs';
import fsp from 'fs/promises';
import { createStringJsonWriter } from '../../src/jsonWriter/stringJsonWriter';
import path from 'path';

describe('stringJsonWriter', () => {
    it('produces json', async () => {
        const outputFilename = path.join(
            __dirname,
            '../output/stringJsonWriter.json',
        );

        const writeStream = fs.createWriteStream(outputFilename);
        const jsonWriter = createStringJsonWriter((s) => writeStream.write(s));

        jsonWriter
            .beginObject()
            .name('Sherlock')
            .beginObject()
            .name('name')
            .value('Sherlock Holmes')
            .name('address')
            .beginArray()
            .value('221B Baker Street')
            .value('London')
            .close()
            .close()
            .name('Paddington')
            .beginObject()
            .name('name')
            .value('Paddington Bear')
            .name('address')
            .beginArray()
            .value('32 Windsor Gardens')
            .value('London')
            .close()
            .close()
            .close();

        await new Promise((resolve) => writeStream.close(resolve));

        const result = await fsp.readFile(outputFilename, {
            encoding: 'utf-8',
        });

        expect(JSON.parse(result)).toEqual({
            Sherlock: {
                name: 'Sherlock Holmes',
                address: ['221B Baker Street', 'London'],
            },
            Paddington: {
                name: 'Paddington Bear',
                address: ['32 Windsor Gardens', 'London'],
            },
        });
    });
});

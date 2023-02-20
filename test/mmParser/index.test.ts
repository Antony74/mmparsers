import fs from 'fs/promises';
import path from 'path';
import { createMmParser } from '../../src/mmParser';
import { Database } from '../../src/mmParser/mmParseTree';
import { reverseParse } from '../../src/tools/reverseParse';

const mmFiles = [
    'https://raw.githubusercontent.com/metamath/set.mm/develop/demo0.mm',
    //    'https://raw.githubusercontent.com/david-a-wheeler/metamath-test/master/demo0-includer.mm',
    //    'https://raw.githubusercontent.com/metamath/set.mm/develop/set.mm',
];

mmFiles.forEach(async (url) => {
    const filename = url.split('/').pop();

    if (!filename) {
        throw new Error('Not a filename');
    }

    describe(filename, () => {
        let text = '';
        let database: Database = { type: 'database', children: [] };

        beforeAll(async () => {
            const filePath = path.join(__dirname, '../../examples', filename);
            const stat = await fs.stat(filePath).catch(() => undefined);

            if (stat) {
                text = await fs.readFile(filePath, { encoding: 'utf-8' });
            } else {
                const response = await fetch(url);
                text = await response.text();
                await fs.writeFile(filePath, text);
            }

            const parser = createMmParser();
            parser.feed(text);
            database = parser.finish();
        });

        it('should reverse parse', () => {
            const reverseParseText = reverseParse(database);
            expect(text).toEqual(reverseParseText);
        });

        // it('should conform to the schema');
    });
});

import fs from 'fs/promises';
import path from 'path';
import prettier from 'prettier';
import * as tsj from 'ts-json-schema-generator';
import Ajv, { ValidateFunction } from 'ajv';
import { createMmParser } from '../../src/mmParser';
import { Database } from '../../src/mmParser/mmParseTree';
import { reverseParse } from '../../src/tools/reverseParse';
const mmFiles = [
    'https://raw.githubusercontent.com/metamath/set.mm/develop/demo0.mm',
    'https://raw.githubusercontent.com/david-a-wheeler/metamath-test/master/demo0-includer.mm',
    //    'https://raw.githubusercontent.com/metamath/set.mm/develop/set.mm',
];

let ajv: Ajv;
let validateFn: ValidateFunction;

beforeAll(async () => {
    const tsPath = path.join(__dirname, '../../src/mmParser/mmParseTree.ts');
    const schemaGenerator = tsj.createGenerator({
        path: tsPath,
    });
    const schema = schemaGenerator.createSchema('Database');
    const schemaString = prettier.format(JSON.stringify(schema), {
        parser: 'json',
    });
    const schemaPath = path.join(__dirname, '../../schemas/mmSchema.json');
    await fs.writeFile(schemaPath, schemaString);
    ajv = new Ajv();
    validateFn = ajv.compile(schema);
});

mmFiles.forEach(async (url) => {
    const filename = url.split('/').pop();

    if (!filename) {
        throw new Error('Not a filename');
    }

    describe(filename, () => {
        let text = '';
        let database: Database = { type: 'database', children: [] };

        beforeAll(async () => {
            // Obtain the .mm file

            const filePath = path.join(__dirname, '../../examples', filename);
            const stat = await fs.stat(filePath).catch(() => undefined);

            if (stat) {
                text = await fs.readFile(filePath, { encoding: 'utf-8' });
            } else {
                const response = await fetch(url);
                text = await response.text();
                await fs.writeFile(filePath, text);
            }

            // Parse the .mm file
            const parser = createMmParser();
            parser.feed(text);
            database = parser.finish();
            const jsonPath = path.join(
                __dirname,
                '../../examples',
                `${filename}.json`
            );

            // Save the json file
            await fs.writeFile(
                jsonPath,
                prettier.format(JSON.stringify(database), { parser: 'json' })
            );
        });

        it('should reverse parse', () => {
            const reverseParseText = reverseParse(database);
            expect(text).toEqual(reverseParseText);
        });

        it('should conform to the schema', () => {
            const result = validateFn(database);
            const errorDump = JSON.stringify(validateFn.errors, null, 4);
            const errorText = ajv.errorsText(validateFn.errors);
            if (validateFn.errors) {
                console.error(errorDump);
                console.error(errorText);
            }
            expect(result).toEqual(true);
        });
    });
});
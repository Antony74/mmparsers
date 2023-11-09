import { createStringJsonWriter } from '../../src/jsonWriter/stringJsonWriter';

describe('stringJsonWriter', () => {
    it('produces json', async () => {
        let result = '';
        const jsonWriter = createStringJsonWriter((s) => (result += s));

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

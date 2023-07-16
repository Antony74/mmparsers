import { JsonComposite, JsonWriter } from './jsonWriter';

export const createJsonWriter = (): Partial<JsonWriter> => {
    const stack: JsonComposite[] = [];
    //    const top = (): JsonComposite => stack[stack.length - 1];

    // name
    // value
    // beginObject
    // beginArray
    // close

    const jsonWriter = {
        beginObject: (): JsonWriter => {
            stack.push({});
            return jsonWriter;
        },
    } as JsonWriter;

    return jsonWriter;
};

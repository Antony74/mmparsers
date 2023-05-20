import { JsonComposite } from "./jsonWriter";

export const createJsonWriter = (): any => {
    const stack: JsonComposite[] = [];
    const top = (): JsonComposite => stack[stack.length - 1];
    const name = '';

    // name
    // value
    // beginObject
    // beginArray
    // close

    return {
        beginObject: (): void => {
            stack.push({});
        },
        arrayAdd: (item: Json): void => {
            const t = top();
            if (Array.isArray(t)) {
                t.push(item);
            } else {
                throw new Error(`Can't arrayAdd, not an array`);
            }
        },
    };
};

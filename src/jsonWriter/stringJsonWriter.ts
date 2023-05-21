import { Json, JsonWriter } from './jsonWriter';
import { createValidatingJsonWriter } from './validatingJsonWriter';

export const createStringJsonWriter = (
    writeFn: (s: string) => unknown
): JsonWriter => {
    return createValidatingJsonWriter(createRawStringJsonWriter(writeFn));
};

const createRawStringJsonWriter = (
    writeFn: (s: string) => unknown
): JsonWriter => {
    const stack: ('}' | ']')[] = [];
    let commaNeeded = false;

    const jsonWriter: JsonWriter = {
        name: (s: string): JsonWriter => {
            if (commaNeeded) {
                writeFn(',');
                commaNeeded = false;
            }
            writeFn(`"${s}":`);
            return jsonWriter;
        },
        value: (j: Json): JsonWriter => {
            if (commaNeeded) {
                writeFn(',');
            }
            writeFn(JSON.stringify(j));
            commaNeeded = true;
            return jsonWriter;
        },
        beginArray: (): JsonWriter => {
            writeFn('[');
            stack.push(']');
            return jsonWriter;
        },
        beginObject: (): JsonWriter => {
            writeFn('{');
            stack.push('}');
            return jsonWriter;
        },
        close: (): JsonWriter => {
            writeFn(stack.pop()!);
            commaNeeded = false;
            return jsonWriter;
        },
    };

    return jsonWriter;
};

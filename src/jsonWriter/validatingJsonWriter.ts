import { Json, JsonWriter } from './jsonWriter';

enum JsonType {
    array = 'array',
    object = 'object',
    name = 'name',
    eof = 'eof',
}

export const createValidatingJsonWriter = (
    rawWriter: JsonWriter,
): JsonWriter => {
    const stack: JsonType[] = [];
    const stackTop = (): JsonType | undefined =>
        stack.length ? stack[stack.length - 1] : undefined;

    const writer: JsonWriter = {
        name: (s: string): JsonWriter => {
            if (stackTop() !== JsonType.object) {
                throw new Error('Unexpected name in JSON');
            }

            stack.push(JsonType.name);
            rawWriter.name(s);
            return writer;
        },

        value: (j: Json): JsonWriter => {
            const top = stackTop();

            if (top === JsonType.object) {
                if (typeof j === 'number') {
                    throw new Error(`Unexpected number in JSON`);
                } else if (j === true) {
                    throw new Error(`Unexpected true in JSON`);
                } else if (j === false) {
                    throw new Error(`Unexpected false in JSON`);
                } else if (j === null) {
                    throw new Error(`Unexpected null in JSON`);
                } else if (j === undefined) {
                    throw new Error(`Unexpected undefined in JSON`);
                } else if (Array.isArray(j)) {
                    throw new Error(`Unexpected array in JSON`);
                } else if (typeof j === 'object') {
                    throw new Error(`Unexpected object in JSON`);
                } else {
                    throw new Error(
                        'validatingJsonWriter.value: Values inside an object must be named',
                    );
                }
            }

            if (top === JsonType.eof) {
                throw new Error(
                    'Unexpected value after JSON data',
                );
            }

            if (top === JsonType.name) {
                stack.pop();
            }

            if (!stack.length) {
                stack.push(JsonType.eof);
            }

            rawWriter.value(j);
            return writer;
        },

        beginArray: (): JsonWriter => {
            const top = stackTop();

            if (top === JsonType.object) {
                throw new Error('Unexpected array in JSON');
            }

            if (top === JsonType.eof) {
                throw new Error(
                    'Unexpected beginArray after JSON data',
                );
            }

            stack.push(JsonType.array);
            rawWriter.beginArray();
            return writer;
        },

        beginObject: (): JsonWriter => {
            const top = stackTop();

            if (top === JsonType.object) {
                throw new Error(
                    'validatingJsonWriter.beginObject: Values inside an object must be named',
                );
            }

            if (top === JsonType.eof) {
                throw new Error(
                    'Unexpected beginObject after JSON data',
                );
            }

            stack.push(JsonType.object);
            rawWriter.beginObject();
            return writer;
        },

        close: (): JsonWriter => {
            const top = stackTop();
            if (top !== JsonType.array && top !== JsonType.object) {
                throw new Error(
                    'validatingJsonWriter.close: Only arrays and objects can be closed',
                );
            }

            stack.pop();

            if (stackTop() === JsonType.name) {
                stack.pop();
            }

            if (!stack.length) {
                stack.push(JsonType.eof);
            }

            rawWriter.close();
            return writer;
        },

        finish: (): JsonWriter => {
            if (stack.length) {
                throw new Error(`Unexpected end of JSON input`);
            }

            return writer;
        },
    };
    return writer;
};

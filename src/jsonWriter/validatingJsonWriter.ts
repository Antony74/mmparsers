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
                throw new Error(
                    'validatingJsonWriter.name: Only an object can have named properties',
                );
            }

            stack.push(JsonType.name);
            rawWriter.name(s);
            return writer;
        },

        value: (j: Json): JsonWriter => {
            const top = stackTop();

            if (top === JsonType.object) {
                throw new Error(
                    'validatingJsonWriter.value: Values inside an object must be named',
                );
            }

            if (top === JsonType.eof) {
                throw new Error(
                    'validatingJsonWriter.value: no additional values can be added beyond end of file',
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
                throw new Error(
                    'validatingJsonWriter.beginArray: Values inside an object must be named',
                );
            }

            if (top === JsonType.eof) {
                throw new Error(
                    'validatingJsonWriter.value: no additional arrays can be added beyond end of file',
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
                    'validatingJsonWriter.beginObject: no additional objects can be added beyond end of file',
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
                throw new Error(
                    `Incomplete JSON with stack ${JSON.stringify(
                        stack,
                        null,
                        2,
                    )}`,
                );
            }

            return writer;
        },
    };
    return writer;
};

import { Json, JsonWriter } from './jsonWriter';
import { createValidatingJsonWriter } from './validatingJsonWriter';

export const createStringJsonWriter = (
    writeFn: (s: string) => unknown,
): JsonWriter => {
    return createValidatingJsonWriter(createRawStringJsonWriter(writeFn));
};

type JsonStackTypes = '}' | ']' | 'name' | ',';

const createRawStringJsonWriter = (
    writeFn: (s: string) => unknown,
): JsonWriter => {
    const stack: JsonStackTypes[] = [];
    const stackTop = (): JsonStackTypes | undefined =>
        stack.length ? stack[stack.length - 1] : undefined;
    const writeCommaIfNeeded = (): boolean => {
        if (stackTop() === ',') {
            writeFn(',');
            return true;
        }
        return false;
    };

    const jsonWriter: JsonWriter = {
        name: (s: string): JsonWriter => {
            writeCommaIfNeeded();
            writeFn(`"${s}":`);
            stack.push('name');
            return jsonWriter;
        },
        value: (j: Json): JsonWriter => {
            writeCommaIfNeeded();
            writeFn(JSON.stringify(j));
            if (stackTop() === 'name') {
                stack.pop();
            }
            if (stackTop() !== ',') {
                stack.push(',');
            }
            return jsonWriter;
        },
        beginArray: (): JsonWriter => {
            writeCommaIfNeeded();
            writeFn('[');
            stack.push(']');
            return jsonWriter;
        },
        beginObject: (): JsonWriter => {
            writeCommaIfNeeded();
            writeFn('{');
            stack.push('}');
            return jsonWriter;
        },
        close: (): JsonWriter => {
            if (stackTop() === ',') {
                stack.pop();
            }
            if (stackTop() === 'name') {
                stack.pop();
            }
            if (stackTop() === ',') {
                stack.pop();
            }
            writeFn(stack.pop()!);
            return jsonWriter;
        },
    };

    return jsonWriter;
};

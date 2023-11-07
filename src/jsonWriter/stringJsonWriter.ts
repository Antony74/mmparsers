import { Json, JsonWriter } from './jsonWriter';
import { createValidatingJsonWriter } from './validatingJsonWriter';

export const createStringJsonWriter = (
    writeFn: (s: string) => unknown,
): JsonWriter => {
    return createValidatingJsonWriter(createUnvalidatedStringJsonWriter(writeFn));
};

type JsonStackTypes = '}' | ']' | ',';

export const createUnvalidatedStringJsonWriter = (
    writeFn: (s: string) => unknown,
): JsonWriter => {
    const stack: JsonStackTypes[] = [];
    const stackTop = (): JsonStackTypes | undefined =>
        stack.length ? stack[stack.length - 1] : undefined;
    const writeCommaIfNeeded = (): boolean => {
        if (stackTop() === ',') {
            writeFn(stack.pop()!);
            return true;
        }
        return false;
    };

    // const stackString = (): string =>
    //     `[${stack.map((v) => `'${v}'`).join(' ')}]`;

    const jsonWriter: JsonWriter = {
        name: (s: string): JsonWriter => {
            // console.log(`name '${s}' called with stack ${stackString()}`);
            writeCommaIfNeeded();
            writeFn(`"${s}":`);
            return jsonWriter;
        },
        value: (j: Json): JsonWriter => {
            // console.log(`value '${j}' called with stack ${stackString()}`);
            writeCommaIfNeeded();
            writeFn(JSON.stringify(j));
            if (stackTop() !== ',') {
                stack.push(',');
            }
            return jsonWriter;
        },
        beginArray: (): JsonWriter => {
            // console.log(`beginArray called with stack ${stackString()}`);
            writeCommaIfNeeded();
            writeFn('[');
            stack.push(']');
            return jsonWriter;
        },
        beginObject: (): JsonWriter => {
            // console.log(`beginObject called with stack ${stackString()}`);
            writeCommaIfNeeded();
            writeFn('{');
            stack.push('}');
            return jsonWriter;
        },
        close: (): JsonWriter => {
            // console.log(`close called with stack ${stackString()}`);
            if (stackTop() === ',') {
                stack.pop();
            }
            writeFn(stack.pop()!);
            if (stackTop() !== ',') {
                stack.push(',');
            }
            return jsonWriter;
        },
        finish: (): JsonWriter => {
            return jsonWriter;
        },
    };

    return jsonWriter;
};

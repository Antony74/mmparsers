export type JsonPrimative = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type JsonComposite = JsonArray | JsonObject;
export type Json = JsonPrimative | JsonComposite;

export interface JsonWriter {
    name: (s: string) => JsonWriter;
    value: (j: Json) => JsonWriter;
    beginObject: () => JsonWriter;
    beginArray: () => JsonWriter;
    close: () => JsonWriter;
}

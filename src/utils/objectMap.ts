export const objectMap = <T, U>(
    record: Record<string, T>,
    mapFn: (value: T, key: string) => U
): Record<string, U> => {
    return Object.keys(record).reduce<Record<string, U>>(
        (acc, key): Record<string, U> => {
            const value = record[key];
            return { ...acc, [key]: mapFn(value, key) };
        },
        {}
    );
};

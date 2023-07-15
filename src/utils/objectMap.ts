export const objectMap = <T, U>(
    record: Record<string, T>,
    mapFn: (value: T, key: string) => U
): Record<string, U> => {
    return Object.keys(record).reduce((acc, key) => {
        const value = record[key];
        return { ...acc, [key]: mapFn(value, key) };
    }, {});
};

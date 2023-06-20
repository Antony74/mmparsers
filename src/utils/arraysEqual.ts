
export const arraysEqual = (arr1: Array<unknown>, arr2: Array<unknown>): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let n = 0; n < arr1.length; ++n) {
        if (arr1[n] !== arr2[n]) {
            return false;
        }
    }

    return true;
};

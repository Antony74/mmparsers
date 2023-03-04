// nodejs has an inbuilt profiler, but sometimes we just want to measure
// the performance of a bunch of specific functions.  In which case we
// can wrap them as follows

export const performanceInfoWrap = <
    FN extends (...args: Parameters<FN>) => ReturnType<FN>
>(
    name: string,
    fn: (...args: Parameters<FN>) => ReturnType<FN>
): ((...args: Parameters<FN>) => ReturnType<FN>) => {
    let callCount = 0;
    let callTime = 0;
    const wrappedFn = (...args: Parameters<FN>): ReturnType<FN> => {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();

        callTime += end - start;
        ++callCount;
        return result;
    };
    return Object.assign(wrappedFn, {
        report: () => {
            const seconds = (callTime / 1000
            ).toFixed(2);
            return `${name} called ${callCount} time(s) taking ${seconds} seconds`;
        },
    });
};

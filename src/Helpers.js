export function customRound(doubleN, precision = 2) {
    return Math.round(doubleN * Math.pow(10, precision)) / Math.pow(10, precision);
}
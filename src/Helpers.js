export function customRound(doubleN, precision = 2) {
    return Math.round(doubleN * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function matchDict(dict1, dict2) {
    for (const key of Object.keys(dict1)) {
        if (dict1[key] != dict2[key]) {
            return false;
        }
    }
    return true;
}

export function getBaseUrl() {
    return "http://localhost:5000";
}
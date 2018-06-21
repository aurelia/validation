export function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
export function isNumber(value) {
    return Object.prototype.toString.call(value) === '[object Number]';
}

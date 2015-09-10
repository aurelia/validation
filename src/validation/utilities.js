export class Utilities {
  static getValue(val) {
    if (val !== undefined && typeof(val) === 'function') {
      return val();
    }
    return val;
  }
  static isEmptyValue(val) {
    if (val === undefined) {
      return true;
    }
    if (val === null) {
      return true;
    }
    if (val === '') {
      return true;
    }
    if (typeof (val) === 'string') {
      if (String.prototype.trim) {
        val = val.trim();
      } else {
        val = val.replace(/^\s+|\s+$/g, '');
      }
    }
    if (val.length !== undefined) {
      return val.length === 0;
    }
    return false;
  }
}

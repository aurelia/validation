export class PASSING_RULE {
  validate() {
    return undefined;
  }
}

export class FAILING_RULE {
  validate() {
    return 'failed';
  }
}

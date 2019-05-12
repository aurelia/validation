interface PropertyCustomization {
  name: string;
  displayName?: string;
  tag?: string;
}

export class PropertyCustomizations {
  private static key = '__properties-customizations__';

  /**
   * Applies the property customizations to a target.
   */
  public static set(target: any, propertyCustomizations: PropertyCustomization[]): void {
    if (target instanceof Function) {
      target = target.prototype;
    }
    Object.defineProperty(
      target,
      PropertyCustomizations.key,
      { enumerable: false, configurable: false, writable: true, value: propertyCustomizations });
  }

  /**
   * Removes property customizations from a target.
   */
  public static unset(target: any): void {
    if (target instanceof Function) {
      target = target.prototype;
    }
    target[PropertyCustomizations.key] = null;
  }

  /**
   * Retrieves the target's property customizations.
   */
  public static get(target: any): PropertyCustomization[] | null {
    return target[PropertyCustomizations.key] || null;
  }
}

import { Parser } from 'aurelia-binding';
export declare type PropertyAccessor<TObject, TValue> = (object: TObject) => TValue;
export declare class PropertyAccessorParser {
    private parser;
    static inject: (typeof Parser)[];
    constructor(parser: Parser);
    parse<TObject, TValue>(property: string | number | PropertyAccessor<TObject, TValue>): string | number;
}
export declare function getAccessorExpression(fn: string): string;

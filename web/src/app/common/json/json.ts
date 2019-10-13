import {isJsonArray, isJsonObject, isJsonRef, JsonObject} from './types';

export type Decoder<T> = (obj: unknown, ...path: string[]) => T;

export function fromString(obj: unknown, ...path: string[]): string {
  if (typeof obj !== 'string') {
    throw new TypeError(`Expected a string at '$.${path.join('')}', got ${obj}`);
  }
  return obj;
}

export function fromNumber(obj: unknown, ...path: string[]): number {
  if (typeof obj !== 'number') {
    throw new TypeError(`Expected a number at '$.${path.join('')}', got ${obj}`);
  }
  return obj;
}

export function fromBoolean(obj: unknown, ...path: string[]): boolean {
  if (typeof obj !== 'boolean') {
    throw new TypeError(`Expected a boolean at '$.${path.join('')}', got ${obj}`);
  }
  return obj;
}

export function fromArray<T>(fromItem: Decoder<T>): Decoder<T[]> {
  return (obj: unknown, ...path: string[]) => {
    if (!Array.isArray(obj)) {
      throw new TypeError(`Expected an array at '$.${path.join('')}'`);
    }
    return obj.map((item, index) => {
      return fromItem(item, ...path, `[${index}]`);
    });
  };
}

export function fromNullable<T>(decoder: Decoder<T>): Decoder<T | null> {
  return (obj: unknown, ...path: string[]) => {
    if (obj == null) {
      return null;
    } else {
      return decoder(obj, ...path);
    }
  };
}

export type PropertyDecoder<T> = (props: JsonObject, ...path: string[]) => T;


export function fromObject<T>(decodeProperties: PropertyDecoder<T>): Decoder<T>;
export function fromObject<T>(decodeProperties: PropertyDecoder<T>, nullable: true): Decoder<T | null>;

export function fromObject<T>(decodeProperties: PropertyDecoder<T>, nullable: boolean = false): Decoder<T | null> {
  return (obj: unknown, ...path: string[]) => {
    if (nullable && obj == null) {
      return null;
    }
    if (!isJsonObject(obj)) {
      throw new TypeError(`Expected an object at ${path.join('')}`);
    }
    return decodeProperties(obj as {[K in keyof T]: unknown}, ...path);
  };
}

export interface SelectDecoder<T> {
  readonly ifBoolean  ?: Decoder<T>;
  readonly ifNumber   ?: Decoder<T>;
  readonly ifString   ?: Decoder<T>;
  readonly ifObject   ?: Decoder<T>;
  readonly ifArray    ?: Decoder<T>;

  readonly ifRef      ?: Decoder<T>;
}

export interface NullableDecoder<T> {
  readonly ifNull     ?: (() => T) | null;
}


export function fromJson<T>(select: SelectDecoder<T>): Decoder<T>;
export function fromJson<T>(select: SelectDecoder<T> & NullableDecoder<T>): Decoder<T | null>;
export function fromJson<T>(select: SelectDecoder<T> & Partial<NullableDecoder<T>>): Decoder<T | null> {
  return (json: unknown, ...path: string[]) => {
    if (json === null) {
      return fromNull(select);
    }
    let acceptTypes = [];
    if (select.ifBoolean) {
      if (typeof json === 'boolean') { return select.ifBoolean(json); }
      acceptTypes.push('boolean');
    }
    if (select.ifNumber) {
      if (typeof json === 'number') { return select.ifNumber(json); }
      acceptTypes.push('number');
    }
    if (select.ifString) {
      if (typeof json === 'string') { return select.ifString(json); }
      acceptTypes.push('string');
    }
    if (select.ifObject) {
      if (isJsonObject(json)) { return select.ifObject(json); }
      acceptTypes.push('object');
    }
    if (select.ifArray) {
      if (isJsonArray(json)) { return select.ifArray(json); }
      acceptTypes.push('object');
    }
    if (select.ifRef) {
      if (isJsonRef(json)) { return select.ifRef(json); }
      acceptTypes.push('ref');
    }
    acceptTypes = acceptTypes.map(type => `'${type}'`);
    throw new Error(`Unexpected type. Expected '${acceptTypes.join(' | ')}' at ${path.join('')}`);
  };
}

function fromNull<T>(options: {ifNull?: (() => T) | null }, ...path: string[]): T | null {
  if (options.ifNull === null) {
    return null;
  } else if (options.ifNull) {
    return options.ifNull();
  }
  throw new Error(`Unexpected null at ${path.join('')}`);
}

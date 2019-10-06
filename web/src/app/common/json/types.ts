import {Decoder} from './json';


export type JsonPrimitive = boolean | number | string;
export function isJsonPrimitive(obj: unknown): obj is JsonPrimitive {
  return ['boolean', 'number', 'string'].includes(typeof obj);
}

export interface JsonObject {
  [k: string]: unknown;
}
export function isJsonObject(obj: unknown): obj is JsonObject {
  return obj != null && typeof obj === 'object';
}

export type JsonArray = ReadonlyArray<unknown>;
export function isJsonArray(obj: unknown): obj is JsonArray {
  return Array.isArray(obj);
}

export type JsonRef = JsonObject | string;
export function isJsonRef(obj: any): obj is JsonRef {
  return isJsonObject(obj) || typeof obj === 'string';
}

export interface FromJson<T> {
  readonly ifBoolean?:  Decoder<T>;
  readonly ifNumber?:   Decoder<T>;
  readonly ifString?:   Decoder<T>;
  readonly ifObject?:   Decoder<T>;
  readonly ifArray?:    Decoder<T>;

  readonly ifRef?:      Decoder<T>;
}

export interface FromNull<T> {
  readonly ifNull: (() => T) | null;
}


/**
 * A decoder that preserves its input unchanged
 * @param obj: unknown
 */
export function preserve<T>(obj: unknown): T { return obj as T; }



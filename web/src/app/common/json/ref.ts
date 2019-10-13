import {Decoder} from './json';
import {Observable} from 'rxjs';

export interface Referential {
  readonly id?: number;
}

export type JsonRef<T extends Referential> = T | number;

export function fromRef<T extends Referential>(decode: Decoder<T>): Decoder<T | number> {
  return (obj: unknown, ...path: string[]) => {
    if (typeof obj === 'number') {
      return obj;
    } else if (typeof obj === 'object' && obj != null) {
      const t = decode(obj);
      if (typeof t.id !== 'number') {
        throw new Error(`A reference object must have an 'id'.`);
      }
      return t;
    } else {
      throw new Error(`Expected an object or reference at ${path.join('')}, got: ${obj}`);
    }
  };
}

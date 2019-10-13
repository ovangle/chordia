import {Inject, Injectable, InjectionToken, Provider} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Decoder, fromArray, fromNullable, fromObject, fromString} from '../json/json';
import {map} from 'rxjs/operators';
import {Referential} from '../json/ref';
import {API_ROOT_HREF} from './api.service';

export interface ResponsePage<T> {
  items: Array<T>;
  next: string | null;
  previous: string | null;
}

export function responsePageFromJson<T>(itemFromJson: Decoder<T>): Decoder<ResponsePage<T>> {
  return fromObject<ResponsePage<T>>(props => ({
    items: fromArray(item => itemFromJson(item))(props.items, 'items'),
    next: fromNullable(fromString)(props.next, 'next'),
    previous: fromNullable(fromString)(props.next, 'previous')
  }));

}

export interface IndexedResponse<T> {
  getPage(index: number): Observable<ResponsePage<T>>;
}


@Injectable()
export class ApiBaseService {
  constructor(
    readonly http: HttpClient,
    @Inject(API_ROOT_HREF)
    readonly apiRootHref: string
  ) {
  }

  get(path: string, options?: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[] }
    withCredentials?: boolean
  }): Observable<unknown> {
    if (!path.startsWith('/')) {
      return throwError(new Error('API path must be absolute'));
    }
    return this.http.get([this.apiRootHref, path].join(''), options);
  }

  post(path: string, body: unknown): Observable<unknown> {
    if (!path.startsWith('/')) {
      return throwError(new Error('API path must be absolute'));
    }

    return this.http.post([this.apiRootHref, path].join(''), body);
  }

  resource<T extends Referential>(options: {
    fromJson: Decoder<T>,
    resourcePath: string
  }) {
    return new ApiResource(this, options.fromJson, options.resourcePath);
  }
}

export class ApiResource<T extends Referential> {
  constructor(
    readonly apiBaseService: ApiBaseService,
    readonly fromJson: Decoder<T>,
    readonly resourcePath: string
  ) {
  }

  fetch(id: number): Observable<T> {
    return this.apiBaseService.get(
      [this.resourcePath, `${id}.json`].join('/'),
    ).pipe(
      map(response => this.fromJson(response))
    );
  }

  create(params?: { [k: string]: unknown }): Observable<T> {
    return this.apiBaseService.post(
      this.resourcePath,
      params
    ).pipe(
      map(response => this.fromJson(response))
    );
  }

  index<U extends Partial<T> = T>(options?: {
    params?: { [k: string]: string | string[] };
    pageSize?: number,
    itemFromJson?: Decoder<U>
  }): IndexedResponse<U> {
    const pageSize = options && options.pageSize || 24;
    const params = {
      ...(options && options.params),
      page_size: pageSize.toString()
    };
    const pageFromJson: Decoder<ResponsePage<U>> = responsePageFromJson((item, ...path) => {
      if (options && options.itemFromJson) {
        return options.itemFromJson(item, ...path);
      }
      return this.fromJson(item, ...path) as Partial<T> as U;
    });

    return {
      getPage: (index: number) => {
        const pageParams = {
          ...params,
          page: index
        };
        return this.apiBaseService.get(this.resourcePath + '.json', {params}).pipe(
          map((response) => pageFromJson(response))
        );
      }
    };

  }

}



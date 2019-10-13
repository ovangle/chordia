import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {fromNullable, fromNumber, fromObject, fromString} from '../../common/json/json';
import {Artist, artistFromJson} from '../artist/artist-model.service';
import {ApiBaseService, IndexedResponse} from '../../common/api/api-resource.service';
import {fromRef} from '../../common/json/ref';

export interface Song {
  readonly artistId: number;
  readonly artistName: string;

  readonly id: number;
  readonly name: string;
  readonly content: string;
  readonly transposeInterval: number | null;
}

export const songFromJson = fromObject<Song>((props, ...path: string[]) => ({
  id: fromNumber(props.id, ...path, 'id'),
  artistId: fromNumber(props.artist_id, ...path, 'artist_id'),
  artistName: fromString(props.artist_name, ...path, 'artist_name'),

  name: fromString(props.name, ...path, 'name'),
  content: fromString(props.tab, ...path, 'tab'),
  transposeInterval: fromNullable(fromNumber)(props.transpose_interval, ...path, 'transpose_interval')
}));

export interface SongMinimal {
  readonly artistId: number;
  readonly artistName: string;

  readonly id: number;
  readonly name: string;
}

export const songMinimalFromJson = fromObject<SongMinimal>((props, ...path) => ({
  id: fromNumber(props.id, ...path, 'id'),
  name: fromString(props.name, ...path, 'name'),
  artistId: fromNumber(props.artist_id, ...path, 'artist_id'),
  artistName: fromString(props.artist_name, ...path, 'artist_name'),
}));


@Injectable()
export class SongModelService {
  constructor(
    readonly api: ApiBaseService
  ) {}

  get resource() {
    return this.api.resource({
      fromJson: songFromJson,
      resourcePath: '/songs'
    });
  }

  fetch(id: number) {
    return this.resource.fetch(id);
  }

  create(options: {
    artist: Artist | number,
    name: string,
    href: string
  }): Observable<Song> {
    return this.resource.create({
      artist_id: fromRef(artistFromJson)(options.artist),
      name: options.name,
      href: options.href
    });
  }

  index(): IndexedResponse<SongMinimal> {
    return this.resource.index<SongMinimal>({
      itemFromJson: songMinimalFromJson
    });
  }
}

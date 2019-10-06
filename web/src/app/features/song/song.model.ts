import {fromNullable, fromNumber, fromObject, fromString} from "../../common/json/json";

export interface Song {
  readonly artistId: number;
  readonly artistName: string;

  readonly id: number;
  readonly name: string;
  readonly content: string;
  readonly transposeInterval: number | null;
}

export const songFromJson = fromObject<Song>((props) => ({
  id: fromNumber(props['id']),
  artistId: fromNumber(props['artist_id']),
  artistName: fromString(props['artist_name']),

  name: fromString(props['name']),
  content: fromString(props['tab']),
  transposeInterval: fromNullable(fromNumber)(props['transpose_interval'])
}));

export interface SongMinimal {
  readonly artistId: number;
  readonly artistName: string;

  readonly id: number;
  readonly name: string;
}

export const songMinimalFromJson = fromObject<SongMinimal>((props) => ({
  id: fromNumber(props['id']),
  name: fromString(props['name']),
    artistId: fromNumber(props['artist_id']),
    artistName: fromString(props['artist_name']),
}));



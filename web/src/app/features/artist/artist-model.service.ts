import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ApiBaseService, ApiResource} from '../../common/api/api-resource.service';
import {fromNumber, fromObject, fromString} from '../../common/json/json';

export interface Artist {
  readonly id: number;
  readonly name: string;
}

export const artistFromJson = fromObject<Artist>((props, ...path) => ({
  id: fromNumber(props.id, ...path, 'id'),
  name: fromString(props.name, ...path, 'name')
}));

@Injectable()
export class ArtistModelService {

  constructor(readonly api: ApiBaseService) {}

  get resource() {
    return this.api.resource({
      resourcePath: '/artists',
      fromJson: (json) => artistFromJson(json),
    });
  }

  create(options: { name: string }): Observable<Artist> {
    return this.resource.create({name: options.name});
  }

}


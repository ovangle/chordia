import {Component, OnDestroy} from "@angular/core";

import {environment} from '../../../environments/environment';
import {BehaviorSubject, Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {map, switchMap} from "rxjs/operators";
import {SongMinimal, songMinimalFromJson} from "./song.model";
import {fromArray} from "../../common/json/json";

const songIndexApiPath = `${environment.apiPath}/api/songs.json`

@Component({
  template: `
    <ul> 
      <li *ngFor="let song of songs$ | async">
        <a [routerLink]="['/songs', song.id]">{{song.artistName}} - {{song.name}}</a>
      </li>
      
    </ul>
  `
})
export class SongIndexComponent implements OnDestroy {
  readonly songs$ = new BehaviorSubject<ReadonlyArray<SongMinimal>>([]);

  private routeSubscription: Subscription;

  constructor(
    readonly http: HttpClient,
    readonly route: ActivatedRoute
  ) {
    this.routeSubscription = this.route.url.pipe(
      switchMap(() => this.http.get<any>(songIndexApiPath)),
      map(response => fromArray((item) => songMinimalFromJson(item))(response['items']))
    ).subscribe(songs => {
      this.songs$.next(songs);
    });

  }


  ngOnDestroy() {
    this.songs$.complete();
    this.routeSubscription.unsubscribe();
  }

}

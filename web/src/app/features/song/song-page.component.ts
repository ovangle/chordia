import {Component, Inject, OnDestroy, ViewEncapsulation} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {map, shareReplay, switchMap, takeUntil} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Song, songFromJson} from "./song.model";
import {BehaviorSubject, Subject, Subscription} from "rxjs";

import {environment} from '../../../environments/environment';

function fetchSongApiPath(songId: any) {
  return `${environment.apiPath}/api/songs/${songId}.json`;
}

@Component({
  template: `
    <ng-container *ngIf="song$ | async as song">
      <h1>
        <span>{{song.artistName}} - {{song.name}}</span>
        <button mat-button routerLink="/songs">
          <mat-icon>home</mat-icon>
          Home
        </button>   
      </h1>

      <app-song-tab
        [song]="song$ | async"
        (songChange)="handleSongChange($event)"
      ></app-song-tab>
    </ng-container>
  `,
  styles: [`
      :host {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
      }

      app-song-tab {
          flex-grow: 1;
      }

  `]
})
export class SongPageComponent implements OnDestroy {
  private readonly songSubject = new BehaviorSubject<Song | undefined>(undefined);
  readonly song$ = this.songSubject.asObservable();

  private routeSubscription: Subscription;

  constructor(
    readonly http: HttpClient,
    readonly router: Router,
    readonly route: ActivatedRoute
  ) {
    // TODO: Should be a resolver
    this.routeSubscription = this.route.url.pipe(
      map(segments => segments[segments.length - 1]),
      switchMap(songId => this.http.get(fetchSongApiPath(songId))),
      map(response => songFromJson(response)),
    ).subscribe((song) => {
      this.songSubject.next(song)
    });
  }


  ngOnDestroy() {
    this.songSubject.complete();
    this.routeSubscription.unsubscribe();
  }


  handleSongChange(song: Song) {
    this.songSubject.next(song);
  }

}

import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';

import {Song, SongModelService} from './song.model-service';

@Component({
  template: `
    <ng-container *ngIf="song$ | async as song">
      <h1>
        <span class="artist-name">
          <a [routerLink]="['/artists', song.artistId ]">{{song.artistName}}</a>
        </span>
        <span class="song-name">{{song.name}}</span>
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

  `],
  providers: [
    SongModelService
  ]
})
export class SongPageComponent implements OnDestroy {
  private readonly songSubject = new BehaviorSubject<Song | undefined>(undefined);
  readonly song$ = this.songSubject.asObservable();

  private routeSubscription: Subscription;

  constructor(
    readonly route: ActivatedRoute,
    readonly songs: SongModelService
  ) {
    // TODO: Should be a resolver
    this.routeSubscription = this.route.url.pipe(
      map(segments => +segments[segments.length - 1]),
      switchMap(songId => this.songs.fetch(songId))
    ).subscribe((song) => {
      this.songSubject.next(song);
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

import {Component, OnDestroy} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {fromArray} from '../../common/json/json';
import {SongMinimal, SongModelService} from './song.model-service';

@Component({
  template: `
    <ul>
      <li *ngFor="let song of songs$ | async">
        <a [routerLink]="['/songs', song.id]">{{song.artistName}} - {{song.name}}</a>
      </li>
    </ul>
  `,
  providers: [
    SongModelService
  ]
})
export class SongIndexComponent implements OnDestroy {
  readonly songs$ = new BehaviorSubject<ReadonlyArray<SongMinimal>>([]);

  private routeSubscription: Subscription;

  constructor(
    readonly route: ActivatedRoute,
    readonly model: SongModelService
  ) {
    this.routeSubscription = this.route.url.pipe(
      switchMap(url => this.model.index().getPage(1)),
    ).subscribe(songs => {
      this.songs$.next(songs.items);
    });

  }


  ngOnDestroy() {
    this.songs$.complete();
    this.routeSubscription.unsubscribe();
  }

}

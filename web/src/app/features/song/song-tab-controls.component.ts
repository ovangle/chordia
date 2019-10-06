import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Song} from "./song.model";


@Component({
  selector: 'song-tab-controls',
  template: `
    <ng-container *ngIf="song">
      <div>
        Transpose ({{song.transposeInterval || 0}})
        <button (click)="incrementTransposeInterval.emit(1)">+1</button>
        <button (click)="incrementTransposeInterval.emit(-1)">-1</button>
      </div>
    </ng-container>
  `,
  styles: [`
      .editing {

      }
  `]
})
export class SongTabControlsComponent {
  @Input() song: Song | undefined;

  @Output() incrementTransposeInterval = new EventEmitter<number>();
  @Output() toggleEdit = new EventEmitter<boolean>();
}

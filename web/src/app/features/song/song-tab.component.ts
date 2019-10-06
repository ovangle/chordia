import {Component, ElementRef, EventEmitter, Input, Output} from "@angular/core";
import {Song} from "./song.model";

@Component({
  selector: 'app-song-tab',
  template: `
    <ng-container *ngIf="song">
      <song-tab-editor [song]="song" 
                       (save)="songChange.emit($event)">
        <code>
          <pre [innerHTML]="song.content | chordify: {
            transposeInterval: song.transposeInterval || 0
          }">
          </pre>
        </code>

        <song-tab-controls
          [song]="song"
          (incrementTransposeInterval)="handleTranspose($event)"
        >
        </song-tab-controls>
      </song-tab-editor>
    </ng-container>
  `,
  styles: [`
    :host {
        display: flex;
        flex-direction: column;
        position: relative;
        flex-grow: 1;
    }
    
    code {
        display: block;
        flex-grow: 1;
        border: 1px solid black;
        padding: 1rem 2rem;
        
        line-height: 1.15;
    }

    .chord {
        text-weight: bold;
    }
  `]

})
export class SongTabComponent {

  @Input() song: Song | undefined;
  @Output()
  readonly songChange = new EventEmitter<Song>();

  constructor() {
  }

  handleTranspose(incr: number) {
    if (this.song) {
      let transposeInterval = this.song.transposeInterval || 0;
      transposeInterval = (transposeInterval + incr + 12) % 12;
      this.songChange.emit({
        ...this.song,
        transposeInterval
      });
    }
  }

}


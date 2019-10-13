import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Song} from './song.model-service';


@Component({
  selector: 'song-tab-editor',
  template: `
    <ng-container *ngIf="song">
      <ng-container *ngIf="editingActive$ | async; else tabContent">
        <div class="editor">

          <textarea autofocus
                    [ngModel]="song.content"
                    (ngModelChange)="updateContent($event)"></textarea>

          <div class="editor-controls">

            <button mat-button (click)="saveContent()">
              <mat-icon>save</mat-icon>
              Save
            </button>
            <button mat-button (click)="resetContent()">
              <mat-icon>clear</mat-icon>
              Reset
            </button>
          </div>
        </div>
      </ng-container>

      <ng-template #tabContent>
        <div class="editor">
          <div class="editor-controls">
            <button mat-button (click)="editingActive$.next(true)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
          </div>
          <ng-content></ng-content>
        </div>
      </ng-template>
      <ng-content select="song-tab-controls"></ng-content>
    </ng-container>
  `,
  styles: [`
      :host {
          display: flex;
          flex-grow: 1;
      }

      .editor {
          flex-grow: 1;
          position: relative;
      }

      textarea {
          height: calc(100% - 2rem);
          width: 100%;

          font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          line-height: 1.15;
          font-size: 87.5%
      }

      .editor-controls {
          position: absolute;
          right: 2rem;
          top: 1rem;
      }

    ::ng-deep song-tab-controls {
        margin-left: 2rem;
    }
  `]
})
export class SongTabEditorComponent {
  readonly editingActive$ = new BehaviorSubject(false);

  @Input() song: Song | undefined;

  @Output() readonly save = new EventEmitter<any>();

  updateContent(content: string) {
    if (this.song !== undefined) {
      this.song = {
        ...this.song,
        content: content
      };
    }
  }

  saveContent() {
    this.editingActive$.next(false);
    this.save.emit(this.song);
  }

  resetContent() {
    this.editingActive$.next(false);
  }
}

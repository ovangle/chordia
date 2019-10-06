import {NgModule} from "@angular/core";
import {SongTabComponent} from "./song-tab.component";
import {CommonModule} from "@angular/common";
import {SongPageComponent} from "./song-page.component";
import {RouterModule} from "@angular/router";
import {ChordifyPipe} from "./chord/chordify.pipe";
import {HttpClientModule} from "@angular/common/http";
import {SongTabControlsComponent} from "./song-tab-controls.component";
import {FormsModule} from "@angular/forms";
import {SongTabEditorComponent} from "./song-tab-editor.component";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SongIndexComponent} from "./song-index.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: SongIndexComponent
      },
      {
        path: ':id',
        component: SongPageComponent
      }
    ])
  ],
  declarations: [
    SongIndexComponent,
    SongPageComponent,
    SongTabComponent,
    SongTabControlsComponent,
    SongTabEditorComponent,
    ChordifyPipe
  ]
})
export class SongModule {}

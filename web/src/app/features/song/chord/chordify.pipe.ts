import {Pipe, PipeTransform} from "@angular/core";
import {formatChord, parseChord, transposeChord} from "./chord.model";
import {Song} from "../song.model";


@Pipe({
  name: 'chordify'
})
export class ChordifyPipe implements PipeTransform {
  transform(songTab: string, options: { transposeInterval: number }): string {
    const input = songTab;
    const transposeInterval = options.transposeInterval;

    let index = 0;
    let output = '';
    while (index < input.length) {
      const [chord, remaining] = parseChord(input.slice(index));

      if (chord != null) {
        const afterIndex = input.length - remaining.length;
        if (/^(\s|$)/.test(input.slice(afterIndex))) {
          const chord1 = transposeChord(chord, transposeInterval);
          output += `<span class="chord">${formatChord(chord1)}</span>`
          index = afterIndex;
          continue;
        }
      }
      output += input[index];
      index += 1;
    }
    return output;
  }

}

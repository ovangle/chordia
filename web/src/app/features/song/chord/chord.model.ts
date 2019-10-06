
export type NoteBase = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
const noteBases: ReadonlyArray<NoteBase> = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
export type NoteQualifier = null | 'b' | '#';
const noteQualifiers: ReadonlyArray<NoteQualifier> = ['b', '#'];

const allNotes: ReadonlyArray<Note> = [
  'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'
].map((rawNote) => parseNote(rawNote)[0] as Note);

export type Note = [NoteBase, NoteQualifier];

function parseNote(input: string): [Note | undefined, string] {
  const baseIndex = noteBases.findIndex((base) => input.startsWith(base) || input.startsWith(base.toUpperCase()));
  if (baseIndex < 0) {
    return [undefined, input];
  }
  const noteBase = noteBases[baseIndex];
  input = input.slice(1);
  const qualifierIndex = noteQualifiers.findIndex((base) => input.startsWith((base || '').toString()));
  if (qualifierIndex < 0) {
    return [[noteBase, null], input];
  }
  const noteQualifier = noteQualifiers[qualifierIndex] as NoteQualifier;
  return [[noteBase, noteQualifier], input.slice(1)];
}

function formatNote(note: Note): string {
  const [base, qualifier] = note;
  if (qualifier != null) {
    return base + qualifier;
  }
  return base;
}

function transposeNote(note: Note, interval: number) {
  const noteIndex = allNotes.findIndex((n) => equalNotes(note, n));
  const transposeIndex = (noteIndex + interval + 12) % 12;
  return allNotes[transposeIndex];
}

export function equalNotes(a: Note, b: Note | undefined): boolean {
  if (b === undefined) {
    return false;
  }
  const [aBase, aQualifier] = a;
  const [bBase, bQualifier] = b;

  if (aQualifier === bQualifier) {
    return aBase === bBase;
  }
  if (aQualifier === null) {

  } else if (aQualifier === '#') {
    if (bQualifier == null) {
      return ['B', 'E'].includes(aBase)
        && ['C', 'F'].includes(bBase);
    } else if (bQualifier === 'b') {
      return ['A', 'C', 'D', 'F', 'G'].includes(aBase)
        && ['B', 'D', 'E', 'G', 'A'].includes(bBase)
    }
  } else if (aQualifier == 'b') {
    if (bQualifier == null) {
      return ['C', 'F'].includes(aBase)
        && ['B', 'E'].includes(bBase);
    } else if (bQualifier == '#') {
      return ['B', 'D', 'E', 'G', 'A'].includes(aBase)
        && ['A', 'C', 'D', 'F', 'G'].includes(bBase);
    }
  }
  return false;
}


export type Quality = 'maj' | 'min' | 'aug' | 'dim';
export type Interval = number;

export interface Chord {
  readonly root: Note;
  readonly quality?: Quality;

  readonly interval?: number;
  readonly bassNote?: Note;
}

export function parseChord(input: string): [Chord | undefined, string] {
  const [root, remaining] = parseNote(input);
  if (root === undefined) {
    return [undefined, input];
  }
  let chord: Chord = { root };
  input = remaining;

  if (input.startsWith('m')) {
    if (input.startsWith('maj')) {
      chord = {
        ...chord,
        quality: 'maj' as Quality
      };
      input = input.slice(3);
    } else {
      chord = {
        ...chord,
        quality: 'min' as Quality
      };
      input = input.startsWith('min') ? input.slice(3) : input.slice(1);
    }
  } else if (input.startsWith('dim')) {
    chord = {
      ...chord,
      quality: 'dim' as Quality
    };
    input = input.slice(3);
  }

  if (/^\d/.test(input)) {
    const interval = Number.parseInt(input[0]);
    chord = {
      ...chord,
      interval
    };
    input = input.slice(1);
  }

  if (input.startsWith('/')) {
    input = input.slice(1);
    const [bassNote, remaining] = parseNote(input);
    if (bassNote === undefined) {
      input = '/' + input;
    } else {
      chord = {
        ...chord,
        bassNote
      };
      input = remaining;
    }
  }
  return [chord, input];
}

export function formatChord(chord: Chord): string {
  let output = formatNote(chord.root);
  if (chord.quality != null) {
    if (chord.quality === 'min') {
      output += 'm';
    } else {
      output += chord.quality;
    }
  }
  if (chord.interval != null) {
    output += chord.interval;
  }
  if (chord.bassNote != null) {
    output += `/${formatNote(chord.bassNote)}`
  }
  return output;

}

export function transposeChord(chord: Chord, interval: number): Chord {
  return {
    ...chord,
    root: transposeNote(chord.root, interval),
    bassNote: chord.bassNote && transposeNote(chord.bassNote, interval)

  }
}

export function equalChords(a: Chord, b: Chord): boolean {
  if (a === b) {
    return true;
  }
  if (!equalNotes(a.root, b.root)) {
    return false;
  }

  const aQual = a.quality || 'maj',
        bQual = b.quality || 'maj';

  if (aQual !== bQual) {
    return false;
  }

  if (a.interval !== b.interval) {
    return false;
  }

  if (a.bassNote && !equalNotes(a.bassNote, b.bassNote)) {
    return false;
  }
  return true;
}

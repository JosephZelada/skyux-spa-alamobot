import { FilmShowtime } from './film-showtime';

export class FilmShowtimes {
  constructor(public name: string,
              public showtimeList: FilmShowtime[]) {
  }
}

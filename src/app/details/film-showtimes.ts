
export class FilmShowtimes {
  constructor(public name: string,
              public showtimeList: FilmShowtime[]) {
  }
}

export class FilmShowtime {
  constructor(public sessionId: string,
              public showtime: string,
              public watched: boolean) {
  }
}

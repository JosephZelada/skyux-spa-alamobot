export class BoughtFilm {
  constructor(public sessionId: string,
              public filmName: string,
              public seatCount: number,
              public cinema: string,
              public sessionDateTime: string) {
  }
}

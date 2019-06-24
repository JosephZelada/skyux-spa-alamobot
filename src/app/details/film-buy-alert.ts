export class FilmBuyAlert {
  constructor(public id: string,
              public filmName: string,
              public preferredCinemas: string[],
              public earliestShowtime: Date,
              public latestShowtime: Date,
              public preferredDaysOfTheWeek: string[],
              public overrideSeatingAlgorithm: boolean,
              public seatCount: number) {
  }
}

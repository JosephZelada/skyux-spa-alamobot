import { Seat } from './seat';

export class SeatMap {
  constructor(public filmName: string,
              public theaterNum: number,
              public seats: Map<number, Map<number, Seat>>) {
  }
}

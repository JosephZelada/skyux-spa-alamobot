export class Seat {
  constructor(public id: number,
              public rowIndex: number,
              public columnIndex: number,
              public rowNumber: number,
              public seatNumber: number,
              public areaIndex: number,
              public seatStatus: string,
              public seatBought: boolean,
              public personInSeat: string){
  }
}

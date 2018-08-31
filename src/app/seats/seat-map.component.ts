import {ActivatedRoute} from '@angular/router';
import { Component } from '@angular/core';
import { SeatService } from '../service/seat-service';
import { SeatMap } from '../details/seat-map';
import { OnInit } from '@angular/core';
import { Seat } from '../details/seat';
import { ErrorModalConfig, SkyErrorModalService } from '@blackbaud/skyux/dist/modules/error';


@Component({
  selector: 'seat-map',
  templateUrl: './seat-map.component.html',
  providers: [SeatService, SkyErrorModalService]
})
export class SeatMapComponent implements OnInit{
  public failedToLoadSeats: boolean = false;
  public filmName: string = '';
  public row1 = ["bip","bop","lop","dop","fop","phop","drop"];
  public row2 = ["dec","bart"];
  public row3 = ["grade","panther","rocktop"];
  public rows = [this.row1, this.row2, this.row3];

  public selectedSeats: Array<Seat> = [];

  constructor(private seatService: SeatService,
              private route:ActivatedRoute,
              private errorService: SkyErrorModalService) {
  }

  private cached: any;

  ngOnInit() {
    this.cached = this.seatService.getFilmShowtimeSeats(this.route.snapshot.paramMap.get('sessionId'))
      .map((response:SeatMap) => response.seats)
      .publishReplay(1)
      .refCount()
      .take(1);
  }

  public isEmptySpace(seat: Seat): boolean {
    return seat.rowNumber == 0 || seat.seatNumber == 0
  }

  public seatChosen(seat: Seat): boolean {
    return this.selectedSeats.indexOf(seat) > -1
  }

  public chooseSeat(seat: Seat) {
    //Need to limit to 10 seats only
    if(this.selectedSeats.length >= 10) {
      this.openErrorModal();
      return
    }
    this.selectedSeats.push(seat)
  }

  public unchooseSeat(seat: Seat) {
    //Not deleting properly, we'll probably have to go through and remake the array without the element
    this.selectedSeats.splice(this.selectedSeats.indexOf(seat), 1)
  }

  public openErrorModal() {
    const config: ErrorModalConfig = {
      errorTitle: 'Too many seats picked!',
      errorDescription: 'You tried to select more than 10 seats. Please deselect some seats and try again',
      errorCloseText: 'OK'
    };

    this.errorService.open(config);
  }
}

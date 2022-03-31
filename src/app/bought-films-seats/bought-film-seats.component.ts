import {ActivatedRoute} from '@angular/router';
import { Component } from '@angular/core';
import { SeatService } from '../service/seat-service';
import { SeatMap } from '../details/seat-map';
import { OnInit } from '@angular/core';
import { Seat } from '../details/seat';
import { ErrorModalConfig, SkyErrorModalService } from "@skyux/errors";


@Component({
  selector: 'bought-film-seats',
  templateUrl: './bought-film-seats.component.html',
  providers: [SeatService, SkyErrorModalService]
})
export class BoughtFilmSeatsComponent implements OnInit{
  public failedToLoadSeats: boolean = false;
  public filmName: string = '';
  public cached: any;

  constructor(private seatService: SeatService,
              private route:ActivatedRoute,
              private errorService: SkyErrorModalService) {
  }

  ngOnInit() {
    this.cached = this.seatService.getFilmShowtimeSeats(this.route.snapshot.paramMap.get('sessionId'))
      .map((response:SeatMap) => {
        this.failedToLoadSeats = false;
        this.filmName = response.filmName;
        return response.seats
      })
      .publishReplay(1)
      .refCount()
      .take(1);
  }

  public isEmptySpace(seat: Seat): boolean {
    return seat.seatStatus == 'NONE'
  }

  public isSeatTaken(seat: Seat): boolean {
    return seat.seatStatus == 'SOLD'
  }

  public doesSomeoneHaveSeat(seat: Seat): boolean {
    return seat.seatStatus == 'TAKEN'
  }

  public isSeatBought(seat: Seat): boolean {
    return seat.seatBought
  }

  public showPersonSittingInSeat(seat: Seat) {
    const config: ErrorModalConfig = {
      errorTitle: 'Who is sitting in these seats!',
      errorDescription: seat.personInSeat,
      errorCloseText: 'OK'
    };

    this.errorService.open(config);
  }
}

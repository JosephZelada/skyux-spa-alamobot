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

  public selectedSeats: Array<Seat> = [];

  constructor(private seatService: SeatService,
              private route:ActivatedRoute,
              private errorService: SkyErrorModalService) {
  }

  private cached: any;

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

  public claimSeatsForSession() {
    this.seatService.claimSeatsForSession(this.route.snapshot.paramMap.get('sessionId'), this.selectedSeats).subscribe(ableToBuySeats =>  {
      if(ableToBuySeats) {
        this.openBuyingSuccessModal();
      } else {
        this.openBuyingErrorModal();
      }
    },
    err => this.openBuyingErrorModal());
  }

  public isEmptySpace(seat: Seat): boolean {
    return seat.seatStatus == 'NONE'
  }

  public isSeatTaken(seat: Seat): boolean {
    return seat.seatStatus == 'SOLD'
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

  public openBuyingErrorModal() {
    const config: ErrorModalConfig = {
      errorTitle: 'Unable to buy seats!',
      errorDescription: 'Unable to purchase your chosen seats, please try again. If the issue persists, maybe pick some different seats fucko',
      errorCloseText: 'OK'
    };

    this.errorService.open(config);
  }

  public openBuyingSuccessModal() {
    const config: ErrorModalConfig = {
      errorTitle: 'Seats purchased!',
      errorDescription: 'Ya did it, seats purchased. MVP babyyyyyyy',
      errorCloseText: 'OK'
    };

    this.errorService.open(config);
  }
}

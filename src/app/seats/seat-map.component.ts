import {ActivatedRoute} from '@angular/router';
import { Component } from '@angular/core';
import { SeatService } from '../film-service/seat-service';
import { SeatMap } from '../details/seat-map';
import { Seat } from '../details/seat';

@Component({
  selector: 'film-showtimes',
  templateUrl: './film-showtimes.component.html',
  providers: [SeatService]
})
export class FilmShowtimesComponent {
  public failedToLoadSeats: boolean = false;
  public filmName: string = '';

  constructor(private seatService: SeatService,
              private route:ActivatedRoute) {
  }

  private getFilmShowtimeSeatMap(): Map<number, Map<number, Seat>> {
    let temp;
    this.seatService.getFilmShowtimeSeats(this.route.snapshot.paramMap.get('sessionId'))
      .subscribe((res: SeatMap) => {
        this.failedToLoadSeats = false;
        this.filmName = res.filmName;
        temp =  res.seats
      });
    return temp;
  }

  // private buildListItem(result: any) {
  //   let filmShowtimeListItems: Array<ListItemModel>;
  //   let filmShowtimes: FilmShowtime[] = new Array<FilmShowtime>();
  //   filmShowtimes = Object.assign(filmShowtimes, result);
  //   filmShowtimeListItems = filmShowtimes.map((x: FilmShowtime) => new ListItemModel(x.sessionId, x));
  //   this.currentFilmCount = filmShowtimeListItems.length;
  //
  //   return Observable.of(new ListDataResponseModel({
  //     count: filmShowtimeListItems.length,
  //     items: filmShowtimeListItems
  //   }));
  // }
}

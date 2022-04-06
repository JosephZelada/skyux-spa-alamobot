import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { FilmBuyAlert } from '../details/film-buy-alert';

@Injectable()
export class AlertService {
  public readonly alertApiUrl: string = this._configuration.alamobotApiUrl + '/alert';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getFilmBuyAlertList(): Observable<FilmBuyAlert[]> {
    return this.http.get<FilmBuyAlert[]>(this.alertApiUrl);
  }

  public setFilmWatchedStatus(filmId: string, watched: boolean) {
    this.http.post<string>(this.alertApiUrl + '?watched=' + watched, {}).subscribe();
  }

  public setNewAlert(filmBuyAlert: FilmBuyAlert) {
    this.http.post<string>(this.alertApiUrl +
      '?film_name=' + filmBuyAlert.filmName +
      '&preferred_cinemas=' + filmBuyAlert.preferredCinemas +
      '&earliest_showtime=' + filmBuyAlert.earliestShowtime +
      '&latest_showtime=' + filmBuyAlert.latestShowtime +
      '&preferred_days_of_the_week=' + filmBuyAlert.preferredDaysOfTheWeek +
      '&override_seating_algorithm=' + filmBuyAlert.overrideSeatingAlgorithm +
      '&seat_count=' + filmBuyAlert.seatCount, filmBuyAlert).subscribe();
  }

  public deleteAlert(alertId: string) {
    this.http.delete<string>(this.alertApiUrl +
      '/' + alertId).subscribe();
  }
}

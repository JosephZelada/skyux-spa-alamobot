import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { FilmBuyAlert } from '../details/film-buy-alert';
import {Seat} from '../details/seat';

@Injectable()
export class AlertService {
  public readonly alertApiUrl: string = this._configuration.alamobotApiUrl + '/alert';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getFilmBuyAlertList(): Observable<FilmBuyAlert[]> {
    return this.http.get(this.alertApiUrl);
  }

  public setFilmWatchedStatus(filmId: string) {
    this.http.post<string>(this.alertApiUrl + '?watched=' + watched, {}).subscribe();
  }
}

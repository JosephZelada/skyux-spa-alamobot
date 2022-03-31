import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FilmBuyAlert } from '../details/film-buy-alert';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AlertService {
  public readonly alertApiUrl: string = this._configuration.alamobotApiUrl + '/alert';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getFilmBuyAlertList(): Observable<FilmBuyAlert[]> {
    return this.http.get(this.alertApiUrl).pipe(
      map((response: HttpResponse<FilmBuyAlert[]>) =>
        {
          return response.body;
        }
      )
    );
  }

  public setFilmWatchedStatus(filmId: string, watched: boolean) {
    this.http.post<string>(this.alertApiUrl + '?watched=' + watched, {}).subscribe();
  }
}

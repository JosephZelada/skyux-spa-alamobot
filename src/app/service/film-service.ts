import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { FilmShowtimes } from '../details/film-showtimes';
import { ListDataRequestModel } from '@blackbaud/skyux/dist/modules/list';
import { EntityPage } from '../details/entity-page';
import { PageableSortableService } from '../shared/pageable-sortable-service';

@Injectable()
export class FilmService extends PageableSortableService {
  public readonly filmApiUrl: string = this._configuration.alamobotApiUrl + '/film';
  public readonly filmShowtimeApiUrl: string = this._configuration.alamobotApiUrl + '/movie';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
    super(http);
  }

  public getFilmList(request: ListDataRequestModel): Observable<EntityPage> {
    return this.getEntityList(request, this.filmApiUrl);
  }

  public getFilmShowtimeList(filmId: string): Observable<FilmShowtimes> {
    return this.http.get(this.filmApiUrl + '/' + filmId);
  }

  public setFilmWatchedStatus(filmId: string, watched: boolean) {
    console.log('trying to set the watched status on ' + this.filmApiUrl + '/' + filmId);
    this.http
      .post<string>(this.filmApiUrl + '/' + filmId + '?watched=' + watched, {}).subscribe((response) => {
      console.log(response);
    });
  }

  public setSessionWatchedStatus(sessionId: string, watched: boolean) {
    console.log('trying to set the watched status on ' + this.filmShowtimeApiUrl + '/' + sessionId);
    this.http
      .post<string>(this.filmShowtimeApiUrl + '/' + sessionId + '?watched=' + watched, {}).subscribe();
  }
}

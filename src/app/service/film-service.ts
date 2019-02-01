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

  public getFilmList(request: ListDataRequestModel, marketId: string): Observable<EntityPage> {
    let sortOrder;
    let sortColumn;
    if (request.sort.fieldSelectors.length === 0) {
      sortOrder = 'desc';
      sortColumn = 'watched';
    } else {
      sortOrder = request.sort.fieldSelectors[0].descending ? 'desc' : 'asc';
      sortColumn = request.sort.fieldSelectors[0].fieldSelector;
    }
    let params: { [key: string]: string } = {
      sort_by: sortColumn,
      order_by: sortOrder,
      page_number: request.pageNumber.toString(),
      page_size: request.pageSize.toString(),
      market_id: marketId
    };
    let queryString = Object.keys(params).map((key) => key + '=' + params[key]).join('&');
    return this.httpClient.get(this.filmApiUrl + '?' + queryString);
  }

  public getFilmShowtimeList(filmId: string, cinemaId: string): Observable<FilmShowtimes> {
    return this.http.get(this.filmApiUrl + '/' + cinemaId + '/' + filmId);
  }

  public setFilmWatchedStatus(filmId: string, watched: boolean) {
    this.http.post<string>(this.filmApiUrl + '/' + filmId + '?watched=' + watched, {}).subscribe();
  }

  public setSessionWatchedStatus(sessionId: string, watched: boolean) {
    this.http.post<string>(this.filmShowtimeApiUrl + '/' + sessionId + '?watched=' + watched, {}).subscribe();
  }
}

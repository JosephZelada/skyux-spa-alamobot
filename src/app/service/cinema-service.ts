import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { ListDataRequestModel } from '@blackbaud/skyux/dist/modules/list';
import { EntityPage } from '../details/entity-page';
import { CinemaEntity } from '../details/entity';

@Injectable()
export class CinemaService {
  public readonly marketApiUrl: string = this._configuration.alamobotApiUrl + '/market';
  public readonly cinemaApiUrl: string = this._configuration.alamobotApiUrl + '/cinema';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getCinemaList(request: ListDataRequestModel, marketId: string, filmId: string): Observable<EntityPage> {
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
      search_term: request.search.searchText,
    };
    let queryString = Object.keys(params).map((key) => key + '=' + params[key]).join('&');
    return this.http.get(this.marketApiUrl +'/' + marketId + '/' + filmId + '?' + queryString);
  }

  public getWatchedCinemaListForMarket(marketId: string): Observable<CinemaEntity[]> {
    return this.http.get(this.cinemaApiUrl + '?market_id=' + marketId);
  }
}

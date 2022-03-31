import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CinemaEntity } from '../details/entity';
import { ListDataRequestModel } from "@skyux/list-builder";
import { EntityPage } from "../details/entity-page";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

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
    return this.http.get(this.marketApiUrl +'/' + marketId + '/' + filmId + '?' + queryString).pipe(
      map((response: HttpResponse<EntityPage>) =>
        {
          return response.body;
        }
      )
    );
  }

  public getWatchedCinemaListForMarket(marketId: string): Observable<CinemaEntity[]> {
    return this.http.get(this.cinemaApiUrl + '?market_id=' + marketId).pipe(
      map((response: HttpResponse<CinemaEntity[]>) =>
        {
          return response.body;
        }
      )
    );
  }
}

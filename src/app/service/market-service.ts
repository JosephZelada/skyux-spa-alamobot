import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { MarketEntity } from '../details/market-entity';
import { ListDataRequestModel } from '@blackbaud/skyux/dist/modules/list';

@Injectable()
export class MarketService {
  public readonly marketApiUrl: string = this._configuration.alamobotApiUrl + '/market';


  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getMarketList(marketName: string, request: ListDataRequestModel): Observable<MarketEntity[]> {
    let sortOrder;
    let sortColumn;
    if (request.sort.fieldSelectors.length === 0) {
      sortOrder = 'desc';
      sortColumn = 'visits';
    } else {
      sortOrder = request.sort.fieldSelectors[0].descending ? 'desc' : 'asc';
      sortColumn = request.sort.fieldSelectors[0].fieldSelector;
    }
    let params: { [key: string]: string } = {
      sort_by: sortColumn,
      order_by: sortOrder,
      page_number: request.pageNumber.toString(),
      page_size: request.pageSize.toString()
    };
    let queryString = Object.keys(params).map((key) => key + '=' + params[key]).join('&');
    return this.http
      .get(this.marketApiUrl + '?' + queryString);
  }

  public setWatchedStatus(marketId: string, watched: boolean) {
    console.log('trying to set the watched status on ' + this.marketApiUrl + '/' + marketId);
    this.http
      .post<string>(this.marketApiUrl + '/' + marketId + '?watched=' + watched, {}).subscribe((response) => {
      console.log(response);
    });
  }
}

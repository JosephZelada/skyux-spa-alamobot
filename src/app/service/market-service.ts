import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { PageableSortableService } from '../shared/pageable-sortable-service';
import { EntityPage } from '../details/entity-page';
import { ListDataRequestModel } from "@skyux/list-builder";
import { Observable } from "rxjs";

@Injectable()
export class MarketService extends PageableSortableService{
  public readonly marketApiUrl: string = this._configuration.alamobotApiUrl + '/market';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
    super(http);
  }

  public getMarketList(request: ListDataRequestModel): Observable<EntityPage> {
    return this.getEntityList(request, this.marketApiUrl);
  }

  public setWatchedStatus(marketId: string, watched: boolean) {
    this.http
      .post<string>(this.marketApiUrl + '/' + marketId + '?watched=' + watched, {}).subscribe();
  }
}

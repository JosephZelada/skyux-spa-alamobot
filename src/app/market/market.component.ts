import { Component } from '@angular/core';
import { AlamobotConstants } from '../details/alamobot-constants';
import { MarketService } from '../service/market-service';
import { EntityPage } from '../details/entity-page';
import { Entity } from '../details/entity';
import { ListItemModel } from "@skyux/list-builder-common";
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from "@skyux/list-builder";
import { Observable, of } from "rxjs";

export class MarketListProvider extends ListDataProvider {
  public failedToLoadMarkets: boolean = false;
  public currentMarketCount: number = 0;

  constructor(private marketService: MarketService) {
    super();
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.getMarketList(request);
  }

  public count(): Observable<number> {
    return of(this.currentMarketCount);
  }

  private getMarketList(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.marketService.getMarketList(request)
      .map((page: EntityPage) => {
          this.failedToLoadMarkets = false;
          const items: ListItemModel[] = page.content.map((market: Entity) => new ListItemModel(market.id.toString(), market));
          return new ListDataResponseModel({count: page.totalElements, items: items});
        }
      )
      .catch((err: any) => {
        this.failedToLoadMarkets = true;
        return Observable.throw(err);
      });
  }
}

@Component({
  selector: 'market',
  templateUrl: './market.component.html',
  providers: [MarketService]
})
export class MarketComponent {
  public listDataProvider: MarketListProvider;
  public alamobotConstants = new AlamobotConstants();
  public pageSize = 10;

  constructor(private marketService: MarketService) {
    this.listDataProvider = new MarketListProvider(this.marketService);
  }

  public get marketCountNum() {
    return this.listDataProvider.currentMarketCount;
  }

  public setMarketStatus(marketEntity: Entity, watched: boolean) {
    this.marketService.setWatchedStatus(marketEntity.id, watched);
  }
}

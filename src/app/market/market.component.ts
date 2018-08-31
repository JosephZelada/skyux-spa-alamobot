import { Component } from '@angular/core';
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from '@blackbaud/skyux/dist/modules/list';
import { Observable } from "rxjs/Observable";
import { ListItemModel } from '@blackbaud/skyux/dist/modules/list/state';
import { AlamobotConstants } from '../details/alamobot-constants';
import { MarketService } from '../service/market-service';
import { MarketEntity } from '../details/market-entity';

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
    return Observable.of(this.currentMarketCount);
  }

  private getMarketList(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.marketService.getMarketList('', request)
      .map((res: any) => {
        this.failedToLoadMarkets = false;
        console.log(res);
        return res.content;
      })
      .flatMap(this.buildListItem)
      .catch((err) => {
        this.failedToLoadMarkets = true;
        return Observable.throw(err);
      });
  }

  private buildListItem(result: any) {
    let marketEntityListItems: Array<ListItemModel>;
    let marketEntities: MarketEntity[] = new Array<MarketEntity>();
    marketEntities = Object.assign(marketEntities, result);
    marketEntityListItems = marketEntities.map((x: any) => new ListItemModel(x.id, x));
    this.currentMarketCount = marketEntityListItems.length;
    return Observable.of(new ListDataResponseModel({
      count: marketEntityListItems.length,
      items: marketEntityListItems
    }));
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
  public pageSize = 30;

  constructor(private marketService: MarketService) {
    this.listDataProvider = new MarketListProvider(this.marketService);
  }

  public get marketCountNum() {
    return this.listDataProvider.currentMarketCount;
  }

  public setMarketStatus(marketEntity: MarketEntity, watched: boolean) {
    console.log(marketEntity);
    this.marketService.setWatchedStatus(marketEntity.id, watched);
  }
}

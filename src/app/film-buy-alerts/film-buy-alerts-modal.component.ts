import { Component } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { SkyModalInstance } from '@blackbaud/skyux/dist/modules/modal';
import { SkyModalDemoContext } from '@blackbaud/skyux/dist/demos/modal/modal-demo-context';
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from '@blackbaud/skyux/dist/modules/list';
import { ListItemModel } from '@blackbaud/skyux/dist/modules/list/state';
import { CinemaEntity } from '../details/entity';
import { CinemaService } from '../service/cinema-service';

export class CinemaListProvider extends ListDataProvider {
  public failedToLoadCinemas: boolean = false;
  public currentCinemaCount: number = 0;

  constructor(private cinemaService: CinemaService) {
    super();
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.getCinemaList();
  }

  public count(): Observable<number> {
    return Observable.of(this.currentCinemaCount);
  }

  private buildListItem(result: any) {
    let cinemaListItems: Array<ListItemModel>;
    let cinemaAlerts: CinemaEntity[] = new Array<CinemaEntity>();
    cinemaAlerts = Object.assign(cinemaAlerts, result);
    cinemaListItems = cinemaAlerts.map((x: CinemaEntity) => new ListItemModel(x.id, x));
    this.currentCinemaCount = cinemaListItems.length;

    return Observable.of(new ListDataResponseModel({
      count: cinemaListItems.length,
      items: cinemaListItems
    }));
  }

  private getCinemaList(): Observable<ListDataResponseModel> {
    return this.cinemaService.getWatchedCinemaListForMarket("0000")
      .map((res: CinemaEntity[]) => {
        this.failedToLoadCinemas = false;
        return res;
      })
      .flatMap(this.buildListItem)
      .catch((err) => {
        this.failedToLoadCinemas = true;
        return Observable.throw(err);
      });
  }
}

@Component({
  selector: 'film-buy-alerts-modal-form',
  templateUrl: './film-buy-alerts-modal.component.html'
})
export class FilmBuyAlertsModalComponent {
  public listDataProvider: CinemaListProvider;
  public title = 'Alert builder';

  constructor(
    public context: SkyModalDemoContext,
    public instance: SkyModalInstance
  ) { }
}

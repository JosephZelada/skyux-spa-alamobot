import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from '@blackbaud/skyux/dist/modules/list';
import { ListItemModel } from '@blackbaud/skyux/dist/modules/list/state';
import { CinemaEntity } from '../details/entity';
import { CinemaService } from '../service/cinema-service';
import {FilmBuyAlert} from '../details/film-buy-alert';
import { AlertService } from "../service/alert-service";

export class CinemaListProvider extends ListDataProvider {
  public failedToLoadCinemas: boolean = false;
  public currentCinemaCount: number = 0;
  public cinemaList: Observable<CinemaEntity[]>;

  constructor(private cinemaService: CinemaService) {
    super();
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.getCinemaList('0000');
  }

  public count(): Observable<number> {
    return Observable.of(this.currentCinemaCount);
  }

  private getCinemaList(marketId: string): Observable<ListDataResponseModel> {
    return this.cinemaService.getWatchedCinemaListForMarket(marketId)
      .map((cinemaList: CinemaEntity[]) =>
        {
          console.log(cinemaList);
          this.cinemaList = Observable.of(cinemaList);
          console.log(this.cinemaList);
          this.failedToLoadCinemas = false;
          const items: ListItemModel[] = cinemaList.map((cinema: CinemaEntity) => new ListItemModel(cinema.id.toString(), cinema));
          return new ListDataResponseModel({count: cinemaList.length, items: items});
        }
      )
      .catch((err) => {
        this.failedToLoadCinemas = true;
        return Observable.throw(err);
      });
  }
}

@Component({
  selector: 'film-buy-alerts-modal-form',
  templateUrl: './film-buy-alerts-modal.component.html',
  providers: [CinemaService, AlertService]
})
export class FilmBuyAlertsModalComponent {
  public listDataProvider: CinemaListProvider;
  public title = 'Alert builder';
  public selectedItems: string[] = [];
  public selectedCinemas: string[] = [];
  public alert: FilmBuyAlert = new FilmBuyAlert('', '', [], undefined, undefined, undefined, false, 0);

  public daysOfTheWeek = Observable.of([
    { id: '1', day: 'Monday', enumName: 'MONDAY' },
    { id: '2', day: 'Tuesday', enumName: 'TUESDAY' },
    { id: '3', day: 'Wednesday', enumName: 'WEDNESDAY' },
    { id: '4', day: 'Thursday', enumName: 'THURSDAY' },
    { id: '5', day: 'Friday', enumName: 'FRIDAY' },
    { id: '6', day: 'Saturday', enumName: 'SATURDAY' },
    { id: '7', day: 'Sunday', enumName: 'SUNDAY' }
  ]);

  constructor(private cinemaService: CinemaService,
              private alertService: AlertService) {
    this.listDataProvider = new CinemaListProvider(this.cinemaService);
  }

  public selectedItemsChange(selectedMap: Map<string, boolean>) {
    this.daysOfTheWeek.take(1).subscribe((daysOfTheWeek) => {
      this.selectedItems = daysOfTheWeek.filter((item) => {
        return selectedMap.get(item.id);
      }).map(dayOfTheWeek => {
        return dayOfTheWeek.enumName;
      });
    });
    this.alert.preferredDaysOfTheWeek = this.selectedItems;
  }

  public selectedCinemasChange(selectedMap: Map<string, boolean>) {
    this.listDataProvider.cinemaList.take(1).subscribe((cinemas) => {
      this.selectedCinemas = cinemas.filter((item) => {
        return selectedMap.get(item.id);
      }).map(cinemaEntity => {
        return cinemaEntity.id;
      });
    });
    this.alert.preferredCinemas = this.selectedCinemas;
  }

  public saveNewFilmAlert() {
    this.alertService.setNewAlert(this.alert);
    console.log(this.alert);
  }
}

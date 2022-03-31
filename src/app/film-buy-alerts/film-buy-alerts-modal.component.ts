import { Component } from '@angular/core';
import { CinemaEntity } from '../details/entity';
import { CinemaService } from '../service/cinema-service';
import { FilmBuyAlert } from '../details/film-buy-alert';
import { Observable, of } from "rxjs";
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from "@skyux/list-builder";
import { ListItemModel } from "@skyux/list-builder-common";
import { catchError, map } from "rxjs/operators";

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
    return of(this.currentCinemaCount);
  }

  private getCinemaList(marketId: string): Observable<ListDataResponseModel> {
    return this.cinemaService.getWatchedCinemaListForMarket(marketId).pipe(
      map((cinemaList: CinemaEntity[]) =>
        {
          console.log(cinemaList);
          this.cinemaList = of(cinemaList);
          console.log(this.cinemaList);
          this.failedToLoadCinemas = false;
          const items: ListItemModel[] = cinemaList.map((cinema: CinemaEntity) => new ListItemModel(cinema.id.toString(), cinema));
          return new ListDataResponseModel({count: cinemaList.length, items: items});
        }
      ),
      catchError((err: any) => {
        this.failedToLoadCinemas = true;
        return Observable.throw(err);
      })
    )
  }
}

@Component({
  selector: 'film-buy-alerts-modal-form',
  templateUrl: './film-buy-alerts-modal.component.html',
  providers: [CinemaService]
})
export class FilmBuyAlertsModalComponent {
  public listDataProvider: CinemaListProvider;
  public title = 'Alert builder';
  public selectedItems: string[] = [];
  public selectedCinemas: string[] = [];
  public alert: FilmBuyAlert = new FilmBuyAlert('', '', [], undefined, undefined, undefined, false, 0);

  public daysOfTheWeek: Observable<any> = of([
    { id: '1', day: 'Monday', enumName: 'MONDAY' },
    { id: '2', day: 'Tuesday', enumName: 'TUESDAY' },
    { id: '3', day: 'Wednesday', enumName: 'WEDNESDAY' },
    { id: '4', day: 'Thursday', enumName: 'THURSDAY' },
    { id: '5', day: 'Friday', enumName: 'FRIDAY' },
    { id: '6', day: 'Saturday', enumName: 'SATURDAY' },
    { id: '7', day: 'Sunday', enumName: 'SUNDAY' }
  ]);

  constructor(private cinemaService: CinemaService) {
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
    console.log(this.alert);
  }
}

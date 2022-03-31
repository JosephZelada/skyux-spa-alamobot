import { Component } from '@angular/core';
import { AlamobotConstants } from '../details/alamobot-constants';
import { AdminService } from '../service/admin-service';
import { BoughtFilm } from '../details/bought-film';
import { Observable, of } from "rxjs";
import { ListItemModel } from "@skyux/list-builder-common";
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from "@skyux/list-builder";

export class BoughtFilmListProvider extends ListDataProvider {
  public failedToLoadFilms: boolean = false;
  public currentFilmCount: number = 0;

  constructor(private adminService: AdminService) {
    super();
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.getBoughtFilmList();
  }

  public count(): Observable<number> {
    return of(this.currentFilmCount);
  }

  private buildListItem(result: any) {
    let boughtFilmListItems: Array<ListItemModel>;
    let boughtFilms: BoughtFilm[] = new Array<BoughtFilm>();
    boughtFilms = Object.assign(boughtFilms, result);
    boughtFilmListItems = boughtFilms.map((x: BoughtFilm) => new ListItemModel(x.sessionId, x));
    this.currentFilmCount = boughtFilmListItems.length;

    return of(new ListDataResponseModel({
      count: boughtFilmListItems.length,
      items: boughtFilmListItems
    }));
  }

  private getBoughtFilmList(): Observable<ListDataResponseModel> {
    return this.adminService.getBoughtFilmsList()
      .map((res: BoughtFilm[]) => {
        this.failedToLoadFilms = false;
        return res;
      })
      .flatMap(this.buildListItem)
      .catch((err: any) => {
        this.failedToLoadFilms = true;
        return Observable.throw(err);
      });
  }
}

@Component({
  selector: 'bought-films',
  templateUrl: './bought-films.component.html',
  providers: [AdminService]
})
export class BoughtFilmsComponent {
  public listDataProvider: BoughtFilmListProvider;
  public alamobotConstants = new AlamobotConstants();

  constructor(private adminService: AdminService) {
    this.listDataProvider = new BoughtFilmListProvider(this.adminService);
  }

  public get filmCountNum() {
    return this.listDataProvider.currentFilmCount;
  }
}

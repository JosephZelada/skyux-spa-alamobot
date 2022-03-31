import { Component } from '@angular/core';
import { AlamobotConstants } from '../details/alamobot-constants';
import { EntityPage } from '../details/entity-page';
import { CinemaEntity } from '../details/entity';
import { CinemaService } from '../service/cinema-service';
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from "@skyux/list-builder";
import { ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { ListItemModel } from "@skyux/list-builder-common";

export class CinemaListProvider extends ListDataProvider{
  public failedToLoadCinemas: boolean = false;
  public currentCinemaCount: number = 0;
  public cinemaName: string = '';

  constructor(private cinemaService: CinemaService,
              private route: ActivatedRoute) {
    super();
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.getCinemaList(request, this.route.snapshot.paramMap.get('marketId'), this.route.snapshot.paramMap.get('filmId'));
  }

  public count(): Observable<number> {
    return of(this.currentCinemaCount);
  }

  private getCinemaList(request: ListDataRequestModel, marketId: string, filmId: string): Observable<ListDataResponseModel> {
    return this.cinemaService.getCinemaList(request, marketId, filmId)
      .map((page: EntityPage) => {
          this.failedToLoadCinemas = false;
          const items: ListItemModel[] = page.content.map((cinema: CinemaEntity) => new ListItemModel(cinema.id.toString(), cinema));
          return new ListDataResponseModel({count: page.totalElements, items: items});
        }
      )
      .catch((err: any) => {
        this.failedToLoadCinemas = true;
        return Observable.throw(err);
      });
  }
}

@Component({
  selector: 'cinema-list',
  templateUrl: './cinema-list.component.html',
  providers: [CinemaService]
})
export class CinemaListComponent {
  public listDataProvider: CinemaListProvider;
  public alamobotConstants = new AlamobotConstants();

  constructor(private cinemaService: CinemaService,
              private route:ActivatedRoute) {
    this.listDataProvider = new CinemaListProvider(this.cinemaService, this.route);
  }

  public get cinemaName() {
    return this.listDataProvider.cinemaName;
  }
}

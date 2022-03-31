import { Component } from '@angular/core';
import { FilmService } from '../service/film-service';
import { AlamobotConstants } from '../details/alamobot-constants';
import { EntityPage } from '../details/entity-page';
import { Entity } from '../details/entity';
import { ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { ListDataProvider, ListDataRequestModel, ListDataResponseModel } from "@skyux/list-builder";
import { ListItemModel } from "@skyux/list-builder-common";
import { catchError, map } from "rxjs/operators";

export class FilmListProvider extends ListDataProvider {
  public failedToLoadFilms: boolean = false;
  public currentFilmCount: number = 0;

  constructor(private filmService: FilmService,
              private route: ActivatedRoute) {
    super();
  }

  public get(request: ListDataRequestModel): Observable<ListDataResponseModel> {
    return this.getFilmList(request, this.route.snapshot.paramMap.get('marketId'));
  }

  public count(): Observable<number> {
    return of(this.currentFilmCount);
  }

  private getFilmList(request: ListDataRequestModel, marketId: string): Observable<ListDataResponseModel> {
    return this.filmService.getFilmList(request, marketId).pipe(
      map((page: EntityPage) => {
          this.failedToLoadFilms = false;
          const items: ListItemModel[] = page.content.map((film: Entity) => new ListItemModel(film.id.toString(), film));
          return new ListDataResponseModel({count: page.totalElements, items: items});
        }
      ), catchError((err: any) => {
        this.failedToLoadFilms = true;
        return Observable.throw(err);
      })
    );
  }
}

@Component({
  selector: 'film-list',
  templateUrl: './film-list.component.html',
  providers: [FilmService]
})
export class FilmListComponent {
  public listDataProvider: FilmListProvider;
  public alamobotConstants = new AlamobotConstants();

  constructor(private filmService: FilmService,
              private route: ActivatedRoute) {
    this.listDataProvider = new FilmListProvider(this.filmService, this.route);
  }

  public get filmCountNum() {
    return this.listDataProvider.currentFilmCount;
  }

  public setFilmStatus(filmEntity: Entity, watched: boolean) {
    this.filmService.setFilmWatchedStatus(filmEntity.id, watched);
  }
}

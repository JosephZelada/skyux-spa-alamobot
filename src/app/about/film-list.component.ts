import { Component } from '@angular/core';
import { FilmService } from '../service/film-service';
import { FilmEntity } from '../details/film-entity';
import { ListDataProvider, ListDataResponseModel } from '@blackbaud/skyux/dist/modules/list';
import { Observable } from "rxjs/Observable";
import { ListItemModel } from '@blackbaud/skyux/dist/modules/list/state';
import { AlamobotConstants } from '../details/alamobot-constants';

export class FilmListProvider extends ListDataProvider {
  public failedToLoadFilms: boolean = false;
  public currentFilmCount: number = 0;

  constructor(private filmService: FilmService) {
    super();
  }

  public get(): Observable<ListDataResponseModel> {
    return this.getFilmList();
  }

  public count(): Observable<number> {
    return Observable.of(this.currentFilmCount);
  }

  private getFilmList(): Observable<ListDataResponseModel> {
    return this.filmService.getFilmList()
      .map((res: any) => {
        this.failedToLoadFilms = false;
        return res;
      })
      .flatMap(this.buildListItem)
      .catch((err) => {
        this.failedToLoadFilms = true;
        return Observable.throw(err);
      });
  }

  private buildListItem(result: any) {
    let filmEntityListItems: Array<ListItemModel>;
    let filmEntities: FilmEntity[] = new Array<FilmEntity>();
    filmEntities = Object.assign(filmEntities, result);
    filmEntityListItems = filmEntities.map((x: any) => new ListItemModel(x.id, x));
    this.currentFilmCount = filmEntityListItems.length;

    return Observable.of(new ListDataResponseModel({
      count: filmEntityListItems.length,
      items: filmEntityListItems
    }));
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

  constructor(private filmService: FilmService) {
    this.listDataProvider = new FilmListProvider(this.filmService);
  }

  public get filmCountNum() {
    return this.listDataProvider.currentFilmCount;
  }

  public setFilmStatus(filmEntity: FilmEntity, watched: boolean) {
    console.log(filmEntity);
    this.filmService.setWatchedStatus(filmEntity.id, watched);
  }
}

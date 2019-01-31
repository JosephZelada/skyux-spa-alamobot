import { Component } from '@angular/core';
import { FilmService } from '../service/film-service';
import { ListDataProvider, ListDataResponseModel } from '@blackbaud/skyux/dist/modules/list';
import { Observable } from "rxjs/Observable";
import { ListItemModel } from '@blackbaud/skyux/dist/modules/list/state';
import { FilmShowtime, FilmShowtimes } from '../details/film-showtimes';
import {ActivatedRoute} from '@angular/router';
import { AlamobotConstants } from '../details/alamobot-constants';

export class FilmShowtimeListProvider extends ListDataProvider{
  public failedToLoadFilms: boolean = false;
  public currentFilmCount: number = 0;
  public filmName: string = '';

  constructor(private filmService: FilmService,
              private route: ActivatedRoute) {
    super();
  }

  public get(): Observable<ListDataResponseModel> {
    return this.getFilmShowtimeList(this.route.snapshot.paramMap.get('filmId'));
  }

  public count(): Observable<number> {
    return Observable.of(this.currentFilmCount);
  }

  private getFilmShowtimeList(filmId: string): Observable<ListDataResponseModel> {
    return this.filmService.getFilmShowtimeList(filmId)
      .map((res: FilmShowtimes) => {
        this.failedToLoadFilms = false;
        this.filmName = res.name;
        return res.showtimeList
      })
      .flatMap(this.buildListItem)
      .catch((err) => {
        this.failedToLoadFilms = true;
        return Observable.throw(err);
      });
  }

  private buildListItem(result: any) {
    let filmShowtimeListItems: Array<ListItemModel>;
    let filmShowtimes: FilmShowtime[] = new Array<FilmShowtime>();
    filmShowtimes = Object.assign(filmShowtimes, result);
    filmShowtimeListItems = filmShowtimes.map((x: FilmShowtime) => new ListItemModel(x.sessionId, x));
    this.currentFilmCount = filmShowtimeListItems.length;

    return Observable.of(new ListDataResponseModel({
      count: filmShowtimeListItems.length,
      items: filmShowtimeListItems
    }));
  }
}

@Component({
  selector: 'film-showtimes',
  templateUrl: './film-showtimes.component.html',
  providers: [FilmService]
})
export class FilmShowtimesComponent {
  public listDataProvider: FilmShowtimeListProvider;
  public alamobotConstants = new AlamobotConstants();

  constructor(private filmService: FilmService,
              private route:ActivatedRoute) {
    this.listDataProvider = new FilmShowtimeListProvider(this.filmService, this.route);
  }

  public get filmName() {
    return this.listDataProvider.filmName;
  }

  public setFilmShowtimeStatus(filmShowtime: FilmShowtime, watched: boolean) {
    console.log(filmShowtime);
    this.filmService.setSessionWatchedStatus(filmShowtime.sessionId, watched);
  }
}

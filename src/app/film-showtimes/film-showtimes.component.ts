import { Component } from '@angular/core';
import { FilmService } from '../service/film-service';
import { FilmShowtime, FilmShowtimes } from '../details/film-showtimes';
import { AlamobotConstants } from '../details/alamobot-constants';
import { ListDataProvider, ListDataResponseModel } from "@skyux/list-builder";
import { ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";
import { ListItemModel } from "@skyux/list-builder-common";
import { flatMap } from "rxjs/internal/operators";
import { catchError, map } from "rxjs/operators";

export class FilmShowtimeListProvider extends ListDataProvider{
  public failedToLoadFilms: boolean = false;
  public currentFilmCount: number = 0;
  public filmName: string = '';

  constructor(private filmService: FilmService,
              private route: ActivatedRoute) {
    super();
  }

  public get(): Observable<ListDataResponseModel> {
    return this.getFilmShowtimeList(this.route.snapshot.paramMap.get('filmId'), this.route.snapshot.paramMap.get('cinemaId'));
  }

  public count(): Observable<number> {
    return of(this.currentFilmCount);
  }

  private getFilmShowtimeList(filmId: string, cinemaId: string): Observable<ListDataResponseModel> {
    return this.filmService.getFilmShowtimeList(filmId, cinemaId).pipe(
      map((res: FilmShowtimes) => {
        this.failedToLoadFilms = false;
        this.filmName = res.name;
        return res.showtimeList
      }),
      flatMap(this.buildListItem),
      catchError((err: any) => {
        this.failedToLoadFilms = true;
        return Observable.throw(err);
      })
    )
  }

  private buildListItem(result: any) {
    let filmShowtimeListItems: Array<ListItemModel>;
    let filmShowtimes: FilmShowtime[] = new Array<FilmShowtime>();
    filmShowtimes = Object.assign(filmShowtimes, result);
    filmShowtimeListItems = filmShowtimes.map((x: FilmShowtime) => new ListItemModel(x.sessionId, x));
    this.currentFilmCount = filmShowtimeListItems.length;

    return of(new ListDataResponseModel({
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
    this.filmService.setSessionWatchedStatus(filmShowtime.sessionId, watched);
  }
}

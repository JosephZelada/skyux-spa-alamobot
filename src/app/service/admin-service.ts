import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BoughtFilm } from '../details/bought-film';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class AdminService {
  public readonly adminApiUrl: string = this._configuration.alamobotApiUrl + '/admin';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getBoughtFilmsList(): Observable<BoughtFilm[]> {
    return this.http.get(this.adminApiUrl + '/filmsBought')
      .pipe(
        map((response: HttpResponse<BoughtFilm[]>) =>
          {
            return response.body;
          }
        )
      );
  }
}

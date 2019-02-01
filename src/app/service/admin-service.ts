import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { BoughtFilm } from '../details/bought-film';

@Injectable()
export class AdminService {
  public readonly adminApiUrl: string = this._configuration.alamobotApiUrl + '/admin';

  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getBoughtFilmsList(): Observable<BoughtFilm[]> {
    return this.http.get(this.adminApiUrl + '/filmsBought');
  }
}

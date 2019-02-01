import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { SeatMap } from '../details/seat-map';
import { Seat } from '../details/seat';

@Injectable()
export class SeatService {
  public readonly seatApiUrl: string = this._configuration.alamobotApiUrl + '/seat';
  public readonly paymentApiUrl: string = this._configuration.alamobotApiUrl + '/payment';


  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getFilmShowtimeSeats(sessionId: string): Observable<SeatMap> {
    return this.http.get(this.seatApiUrl + '/' + sessionId);
  }

  public claimSeatsForSession(sessionId: string, seatsToClaim: Array<Seat>): Observable<boolean> {
    return this.http.post<boolean>(this.paymentApiUrl + '/' + sessionId, seatsToClaim);
  }
}

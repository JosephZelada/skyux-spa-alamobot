import { Injectable } from '@angular/core';
import { Configuration } from '../app.configuration';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SeatMap } from '../details/seat-map';
import { Seat } from '../details/seat';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class SeatService {
  public readonly seatApiUrl: string = this._configuration.alamobotApiUrl + '/seat';
  public readonly paymentApiUrl: string = this._configuration.alamobotApiUrl + '/payment';


  constructor(private http: HttpClient,
              private _configuration: Configuration) {
  }

  public getFilmShowtimeSeats(sessionId: string): Observable<SeatMap> {
    return this.http.get(this.seatApiUrl + '/' + sessionId).pipe(
      map((response: HttpResponse<SeatMap>) =>
        {
          return response.body;
        }
      )
    );
  }

  public claimSeatsForSession(sessionId: string, seatsToClaim: Array<Seat>): Observable<boolean> {
    return this.http.post<boolean>(this.paymentApiUrl + '/' + sessionId, seatsToClaim);
  }
}

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FilmListComponent } from './film-list/film-list.component';
import { FilmShowtimesComponent } from './film-showtimes/film-showtimes.component';
import { MarketComponent } from './market/market.component';
import { SeatMapComponent } from './seats/seat-map.component';
import { CinemaListComponent } from './cinema-list/cinema-list.component';
import { BoughtFilmsComponent } from './bought-films/bought-films.component';
import { BoughtFilmSeatsComponent } from './bought-films-seats/bought-film-seats.component';

const appRoutes: Routes = [
  {path: 'market', component: MarketComponent},
  {path: 'market/:marketId', component: FilmListComponent},
  {path: 'market/:marketId/:filmId', component: CinemaListComponent},
  {path: 'market/:marketId/:filmId/:cinemaId', component: FilmShowtimesComponent},
  {path: 'market/:marketId/:filmId/:cinemaId/:sessionId', component: SeatMapComponent},
  {path: 'bought-films', component: BoughtFilmsComponent},
  {path: 'bought-films/:sessionId/map', component: BoughtFilmSeatsComponent}
  //{path: 'bought-films/:sessionId/list', component: BoughtFilmPatronsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)]
})
export class AppRoutingModule {
}

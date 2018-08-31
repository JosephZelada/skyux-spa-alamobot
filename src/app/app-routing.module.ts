import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FilmListComponent } from './about/film-list.component';
import { FilmShowtimesComponent } from './film-showtimes/film-showtimes.component';
import { MarketComponent } from './market/market.component';
import { SeatMapComponent } from './seats/seat-map.component';

const appRoutes: Routes = [
  {path: 'film-list', component: FilmListComponent},
  {path: 'film-list/:filmId', component: FilmShowtimesComponent},
  {path: 'film-list/:filmId/:sessionId', component: SeatMapComponent},
  {path: 'market', component: MarketComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)]
})
export class AppRoutingModule {
}

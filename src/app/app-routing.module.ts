import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { FilmShowtimesComponent } from './film-showtimes/film-showtimes.component';

const appRoutes: Routes = [
  {path: 'about', component: AboutComponent},
  {path: 'about/:filmId', component: FilmShowtimesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)]
})
export class AppRoutingModule {
}

import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './app.configuration';
import { AppRoutingModule } from './app-routing.module';
import { FilmBuyAlertsModalComponent } from './film-buy-alerts/film-buy-alerts-modal.component';


// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [HttpClientModule],
  providers: [Configuration],
  entryComponents: [FilmBuyAlertsModalComponent],
  exports: [AppRoutingModule]
})
export class AppExtrasModule { }

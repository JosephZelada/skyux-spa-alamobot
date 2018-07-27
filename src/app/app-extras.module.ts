import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './app.configuration';
import { AppRoutingModule } from './app-routing.module';


// Specify entry components, module-level providers, etc. here.
@NgModule({
  imports: [HttpClientModule],
  providers: [Configuration],
  entryComponents: [],
  exports: [AppRoutingModule]
})
export class AppExtrasModule { }

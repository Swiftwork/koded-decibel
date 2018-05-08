import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BokehComponent } from './bokeh/bokeh.component';
import { DecibelComponent } from './decibel/decibel.component';
import { DecibelService } from './decibel/decibel.service';

@NgModule({
  declarations: [
    AppComponent,
    BokehComponent,
    DecibelComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    DecibelService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

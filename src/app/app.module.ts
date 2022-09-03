import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as Cordovasqlitedriver from 'localforage-cordovasqlitedriver';
import { LimitToPipeModule } from './pipes/limit-to.pipe';
import { LastPipe } from './pipes/last.pipe';

@NgModule({
  declarations: [AppComponent, LastPipe],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LimitToPipeModule,
    IonicStorageModule.forRoot({
      name: 'users',
      driverOrder: [Cordovasqlitedriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }



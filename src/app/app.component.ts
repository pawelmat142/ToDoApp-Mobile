import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import * as Cordovasqlitedriver from 'localforage-cordovasqlitedriver';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  
  constructor(
    private appService: AppService
  ){}

}

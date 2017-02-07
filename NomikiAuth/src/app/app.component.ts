import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { MenuPage } from '../pages/menu/menu';
import {AnnouncementsService} from '../providers/announcements';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage = MenuPage;
  rootPage = MenuPage;
  constructor(platform: Platform, announcementsService: AnnouncementsService) {
    platform.ready().then(() => {
      //One Signal
      // Enable to debug issues.
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
      var notificationOpenedCallback = function(jsonData) {
          announcementsService.GetAllAnnouncements();
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
      
  notificationOpenedCallback({});
      window["plugins"].OneSignal
        .startInit("3b1c929b-b6e7-4107-9c5c-91ec58babc65", "1049883997761")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }
}

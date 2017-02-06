import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, File } from 'ionic-native';

import { MenuPage } from '../pages/menu/menu';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as globalVariables from './globalVariables';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage = MenuPage;
private rootPage;
  constructor(platform: Platform, private http: Http) {
    this.http = http;
    platform.ready().then(() => {
      let fs:string = cordova.file.dataDirectory;

      //Initialize announcements
      File.readAsText(fs, "announcements").then(data => {
       if(Object.prototype.toString.call(data) == '[object String]' ) {
          globalVariables.setAnnouncements(JSON.parse(data.toString()));
        }

        this.rootPage = MenuPage;
      })
      .catch(err => {
        console.log(err);
        this.rootPage = MenuPage;
      });

      //Initialize categogies
      File.readAsText(fs, "categories").then(data => {
        if(Object.prototype.toString.call(data) == '[object String]' ) {
          globalVariables.setCategories(JSON.parse(data.toString()));
        }
      }).catch(err => {
        console.log(err);
      });
      //One Signal
      // Enable to debug issues.
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
      var notificationOpenedCallback = function(jsonData) {
          let headers = new Headers({ 'Content-Type': 'application/json' });
          let options = new RequestOptions({ headers: headers });
          var url = "http://www.auth.l2koo.com/NomikiAuth/scraper/scraper-php-api/src/get-announcements.php";
          this.http.post(url, {"all": true},options).map(res => res.json())
          .subscribe(
                data => {
                    
                    globalVariables.setAnnouncements(data);

                    File.writeFile(fs, "announcements", JSON.stringify(data), true).catch(err=>{
                        console.log(err);
                    });
                },
                err => {
                    console.log(err);
                }
                //,
              //() => console.log('Movie Search Complete')
          );
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };

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

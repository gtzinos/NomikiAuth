import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { File } from 'ionic-native';
import * as globalVariables from '../app/globalVariables';

/*
  Generated class for the GetAnnouncements provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AnnouncementsService {

  constructor(public http: Http) {
    console.log('Hello GetAnnouncements Provider');
  }

  GetAllAnnouncements()
  {
      let fs:string = cordova.file.dataDirectory;
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      var url = "http://www.law.l2koo.com";
      this.http.post(url, {"all": true},options).map(res => res.json())
      .subscribe(
            data => {
                
                globalVariables.setAnnouncements(data);
  
                File.writeFile(fs, "announcements.txt", JSON.stringify(data), true).catch(err=>{
                    console.log(err);
                });
            },
            err => {
                console.log(err);
            }
            //,
          //() => console.log('Movie Search Complete')
      );
  }

}

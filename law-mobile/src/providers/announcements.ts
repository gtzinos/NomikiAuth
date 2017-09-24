import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
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

    GetAllAnnouncements2() {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        var url = "http://geotzinos.ddns.net";
        this.http.post(url, { "all": true }, options).map(res => res.json())
            .subscribe(
            data => {

                globalVariables.setAnnouncements(data);

                localStorage.setItem("announcements", JSON.stringify(data));
            },
            err => {
                console.log(err);
            }
            //,
            //() => console.log('Movie Search Complete')
            );
    }

}

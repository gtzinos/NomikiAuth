import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private announcements;
  constructor(private http: Http, public navCtrl: NavController) {
    this.http = http;
  }

  static get parameters() {
        return [[Http]];
    }

  getNotifications()
  {

      var url = "http://localhost/scraper-php-api/src/get-announcements.php";
      var response = this.http.get(url).map(res => res.json())
      .subscribe(
            data => {
                //this.movies = data.results; 
                console.log(data);
            },
            err => {
                console.log(err);
            },
            () => console.log('Movie Search Complete')
        );

       
      return response;
  }

  
}

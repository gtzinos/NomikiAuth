import { Nav, Platform } from 'ionic-angular';
import { AnnouncementPage } from './../announcement/announcement';
import { language, announcements } from './../../app/globalVariables';
import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as globalVariables from '../../app/globalVariables';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private announcements;
  private language: any;
  constructor(private http: Http, private nav: Nav, private platform: Platform) {
    this.http = http;
    this.language = globalVariables.language;
    this.platform = platform;
  }

  ionViewWillEnter()
  {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
      if(globalVariables.announcements == null)
      {
          var url = "http://www.auth.l2koo.com/NomikiAuth/scraper/scraper-php-api/src/get-announcements.php";
          this.http.post(url, {"all": true},options).map(res => res.json())
          .subscribe(
                data => {
                    
                    globalVariables.setAnnouncements(data);
                    this.announcements = globalVariables.announcements; 
                    
                },
                err => {
                    console.log(err);
                }
                //,
              //() => console.log('Movie Search Complete')
          );
       }
       else
       {
         this.announcements = globalVariables.announcements;
       }
  }
  
  openAnnouncementView(announcement)
  {
    //this.nav.setRoot(AnnouncementPage,{"announcement": announcement});
    this.platform.ready().then(() => {
      new InAppBrowser("http://www.law.auth.gr" + announcement.url, '_system');
      console.log(globalVariables.announcements[announcement.category]);
      //globalVariables.announcements[announcement.category][announcement.url].read = true;
      announcement.read = true;
    });
  }

  getCategoryName(category)
  {
    switch(category)
    {
      case "kosmitia": 
        return "Κοσμητείας";
      case "tmimatos":
        return "Τμήματος";
      case "upotrofies": 
        return "για Υποτροφίες";
      case "prokirikseis": 
        return "για προκυρήξεις";
      case "nea_apo_tritous": 
        return "για Νέα από Τρίτους";
      case "vathmologia": 
        return "για Βαθμολογίες";
      case "tomeas_astikou": 
        return "Τομέα Αστικού";
      case "tomeas_dimosiou": 
        return "Τομέα Δημοσίου";
      case "tomeas_diethnwn": 
        return "Τομέα Διεθνών σπουδών";
      case "tomeas_eborikou": 
        return "Τομέα Εμπορικού";
      case "tomeas_istorikou": 
        return "Τομέα Φιλοσοφίας";
      case "tomeas_poinikwn": 
        return "Τομέα ποινικού";
      case "library": 
        return "Βιβλιοθήκης";
      default:
        return "";
    }
  }
}
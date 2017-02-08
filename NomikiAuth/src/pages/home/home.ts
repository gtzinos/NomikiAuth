import { Nav, Platform } from 'ionic-angular';
import { AnnouncementPage } from './../announcement/announcement';
import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as globalVariables from '../../app/globalVariables';
import { InAppBrowser, File } from 'ionic-native';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from './popover';
import { FilterArray } from '../../app/pipes/filterArray';
import { LoadingController, Loading } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private announcements;
  private language: any;
  private categories;
  private loader: Loading;

  constructor(private http: Http, private nav: Nav, private platform: Platform, public popoverCtrl: PopoverController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.http = http;
    this.language = globalVariables.language;
    this.platform = platform;
    this.categories = globalVariables.categoriesObj;
    this.announcements = globalVariables.announcements;
    this.loader = this.loadingCtrl.create({
      content: "Παρακαλώ περιμένετε..."
    });
    this.loader.present();
  }

  

  openFilter(eventObj)
  {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: eventObj
    });
  
    popover.onDidDismiss(data => {
      this.categories = JSON.parse(JSON.stringify(globalVariables.categoriesObj));
      
      let fs = cordova.file.dataDirectory
      let categoriesTemp = this.categories;
      File.writeFile(fs, "categories.txt", JSON.stringify(categoriesTemp), {replace: true}).then( _ => {
        console.log("ok");
      }).catch(err=> {
        console.log(err);
      })
    });
  }
    
  notificationOpenedCallback()
  {
    this.refreshData();
  }

  ionViewWillEnter()
  {
      //One Signal
      // Enable to debug issues.
      // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
  
      window["plugins"].OneSignal
        .startInit("3b1c929b-b6e7-4107-9c5c-91ec58babc65", "1049883997761")
        .handleNotificationOpened(this.notificationOpenedCallback)
        .endInit();

      let fs:string = cordova.file.dataDirectory;

      //Initialize announcements
      File.readAsText(fs, "announcements.txt").then(data => {
       if(Object.prototype.toString.call(data) == '[object String]' ) {
          globalVariables.setAnnouncements(JSON.parse(data.toString()));
          this.announcements = globalVariables.announcements; 
          this.loader.dismiss();
        }  
      })
      .catch(err => {
          console.log(err);
          if(globalVariables.announcements == null || globalVariables.announcements.length == 0)
          {
            this.refreshData();
          }
          else
          {
            this.loader.dismiss();
          }
      });

      //Initialize categogies
      File.readAsText(fs, "categories.txt").then(data => {
        if(Object.prototype.toString.call(data) == '[object String]' ) {
          globalVariables.setCategories(JSON.parse(data.toString()));
        }
      }).catch(err => {
        console.log(err);
      });
  } 

  refreshData(){
    let fs:string = cordova.file.dataDirectory;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
      
    var url = "http://www.auth.l2koo.com/NomikiAuth/scraper/scraper-php-api/src/get-announcements.php";
    this.http.post(url, {"all": true},options).map(res => res.json())
    .subscribe(
          data => {
              
              globalVariables.setAnnouncements(data);
              this.announcements = globalVariables.announcements; 
              // Use Cordova
              let fs:string = cordova.file.dataDirectory;
              let announcements = data;
              File.writeFile(fs, "announcements.txt", JSON.stringify(announcements), {replace: true}).then( _ => {
                console.log("ok");
              }).catch(err=>{
                  console.log(err);
              });
              this.loader.dismiss();
          },
          err => {
              console.log(err);
              this.loader.dismiss();
              this.alertCtrl.create({
                title: 'Πρόβλημα σύνδεσης με τον διακομιστη!',
                subTitle: err,
                buttons: ['OK']
              }).present();
              
          }
          //,
        //() => console.log('Movie Search Complete')
    );
  }

  openAnnouncementView(announcement)
  {
    this.platform.ready().then(() => {
      new InAppBrowser("http://www.law.auth.gr" + announcement.url, '_system');
      //announcement.read = true;
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
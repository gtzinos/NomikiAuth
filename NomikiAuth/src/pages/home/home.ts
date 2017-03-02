import { Nav, Platform } from 'ionic-angular';
import { Component , NgZone} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as globalVariables from '../../app/globalVariables';
import { InAppBrowser, File } from 'ionic-native';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from './popover';
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

  constructor(private ngZone: NgZone, private http: Http, private nav: Nav, private platform: Platform, public popoverCtrl: PopoverController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
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
      let $this = this;
      window["plugins"].OneSignal
        .startInit("3b1c929b-b6e7-4107-9c5c-91ec58babc65", "1049883997761")
        .handleNotificationOpened(function() {
             let headers = new Headers({ 'Content-Type': 'application/json' });
              let options = new RequestOptions({ headers: headers });
                
              var url = "http://www.law.l2koo.com";
              $this.http.post(url, {"all": true},options).map(res => res.json())
              .subscribe(
                    data => {
                        
                  globalVariables.setAnnouncements(data);
                  $this.ngZone.run(()=>{
                      $this.announcements = data;
                      console.log($this.announcements);
                  })
                  
                  // Use Cordova
                  let fs:string = cordova.file.dataDirectory;
                  //let announcements = data;
                  File.writeFile(fs, "announcements.txt", JSON.stringify($this.announcements), {replace: true}).then( _ => {
                    console.log("ok");
                  }).catch(err=>{
                      console.log(err);
                  });
                  $this.loader.dismiss();
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
        })
        .endInit();

      //window["plugins"].OneSignal.sendTag("developer", "george");

      let fs:string = cordova.file.dataDirectory;
      
      File.removeFile(fs, "announcements").catch(err=>{
        console.log("Can't find any file with name announcements");
      });

      File.removeFile(fs, "categories").catch(err=>{
        console.log("Can't find any file with name categories");
      });

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
            this.refreshData(null);
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

  refreshData(refresher?){
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
      
    var url = "http://www.auth.l2koo.com/NomikiAuth/scraper/scraper-php-api/src/get-announcements.php";
    this.http.post(url, {"all": true},options).map(res => res.json())
    .subscribe(
          data => {
              
              globalVariables.setAnnouncements(data);
              this.ngZone.run(()=>{
                  this.announcements = data;
                  console.log(this.announcements);
              })
              
              // Use Cordova
              let fs:string = cordova.file.dataDirectory;
              //let announcements = data;
              File.writeFile(fs, "announcements.txt", JSON.stringify(this.announcements), {replace: true}).then( _ => {
                console.log("ok");
              }).catch(err=>{
                  console.log(err);
              });
              this.loader.dismiss();
              if(refresher != null)
              {
                refresher.complete();
              }
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
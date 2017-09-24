import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { Component, NgZone } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import * as globalVariables from '../../app/globalVariables';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from './popover';
import { LoadingController, Loading } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private announcements;
  private language: any;
  private categories;
  private loader: Loading;

  constructor(private oneSignal: OneSignal, private iab: InAppBrowser, private ngZone: NgZone, private http: Http, public popoverCtrl: PopoverController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) { }

  openFilter(eventObj) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: eventObj
    });

    popover.onDidDismiss(data => {
      this.categories = JSON.parse(JSON.stringify(globalVariables.categoriesObj));
      let categoriesTemp = this.categories;
      localStorage.setItem("categories", JSON.stringify(categoriesTemp));
    });
  }

  notificationOpenedCallback() {
    this.refreshData();
  }

  ionViewDidLoad() {
    this.language = globalVariables.language;
    this.categories = globalVariables.categoriesObj;
    this.announcements = globalVariables.announcements;
    this.loader = this.loadingCtrl.create({
      content: "Παρακαλώ περιμένετε..."
    });
    this.loader.present();

    //One Signal
    // Enable to debug issues.
    // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    this.oneSignal.startInit("3b1c929b-b6e7-4107-9c5c-91ec58babc65", "1049883997761");
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    this.oneSignal.handleNotificationReceived().subscribe(() => {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      var url = "http://geotzinos.ddns.net";
      this.http.post(url, { "all": true }, options).map(res => res.json())
        .subscribe(
        data => {

          globalVariables.setAnnouncements(data);
          this.ngZone.run(() => {
            this.announcements = data;
            console.log(this.announcements);
          })

          //let announcements = data;
          localStorage.setItem("announcements", JSON.stringify(this.announcements));
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

        });
    });

    this.oneSignal.endInit();

    //window["plugins"].OneSignal.sendTag("developer", "george");

    //Initialize announcements

    if (localStorage.getItem("announcements") != undefined) {
      globalVariables.setAnnouncements(JSON.parse(localStorage.getItem("announcements")));
      this.announcements = globalVariables.announcements;
      this.loader.dismiss();
    }
    else {
      if (globalVariables.announcements == null || globalVariables.announcements.length == 0) {
        this.refreshData(null);
      }
      else {
        this.loader.dismiss();
      }
    }

    //Initialize categogies
    if (localStorage.getItem("categories") != undefined) {
      globalVariables.setCategories(JSON.parse(localStorage.getItem("categories")));
    }
  }

  refreshData(refresher?) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    var url = "http://geotzinos.ddns.net";
    this.http.post(url, { "all": true }, options).map(res => res.json())
      .subscribe(
      data => {

        globalVariables.setAnnouncements(data);
        this.ngZone.run(() => {
          this.announcements = data;
          console.log(this.announcements);
        })

        //let announcements = data;
        localStorage.setItem("announcements", JSON.stringify(this.announcements));

        this.loader.dismiss();
        if (refresher != null) {
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

  openAnnouncementView(announcement) {
    const browser = this.iab.create("http://www.law.auth.gr" + announcement.url, '_system');
  }

  getCategoryName(category) {
    switch (category) {
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
import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular'
import { HomePage } from '../home/home';
import * as globalVariables from '../../app/globalVariables';
@Component({
  templateUrl: 'menu.html'
})
export class MenuPage {
  @ViewChild(Nav) nav: Nav;
  // this tells the tabs component which Pages
  // should be each tab's root Page
  rootPage: any;
  pages: any; 
  language: any;
  constructor() 
  { 
    this.rootPage = HomePage;
    this.pages = [
      { title: { "gr": "Όλες οι ανακοινώσεις", "en": "All announcements" }, component: HomePage },
      //{ title: { "gr": "Πληροφορίες", "en": "Informations", component: InformationsPage }
      //{ title: { "gr": "Ρυθμίσεις", "en": "Settings", component: SettingsPage }
    ];
    this.language = globalVariables.language;
  }

    openPage(page) {
      // Reset the content nav to have just this page
      // we wouldn't want the back button to show in this scenario
      this.nav.setRoot(page.component);
    }
}

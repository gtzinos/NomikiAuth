import { FilterArray } from '../../app/pipes/filterArray';
import { PopoverPage } from './popover';
import { AnnouncementsService } from '../../providers/announcements';
import { OneSignal } from '@ionic-native/onesignal';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { IonicPageModule } from 'ionic-angular/module';
import { HomePage } from './home';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    HomePage,
    PopoverPage,
    FilterArray],
  imports: [
    IonicPageModule.forChild(HomePage),
    HttpModule
  ],
  entryComponents: [
    PopoverPage
  ],
  providers: [InAppBrowser, OneSignal, AnnouncementsService]

})
export class HomeModule { }
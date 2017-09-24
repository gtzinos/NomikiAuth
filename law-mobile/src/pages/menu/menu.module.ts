import { IonicPageModule } from 'ionic-angular/module';
import { MenuPage } from './menu';
import { NgModule } from "@angular/core";


@NgModule({
  declarations: [
      MenuPage
  ],
  imports: [
    IonicPageModule.forChild(MenuPage)
  ]

})
export class MenuModule { }
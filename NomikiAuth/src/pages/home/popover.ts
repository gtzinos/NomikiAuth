import { categoriesObj } from './../../app/globalVariables';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import * as globalVariables from '../../app/globalVariables'; 

@Component({
  template: `
    <ion-list>
      <ion-list-header>Κατηγορίες</ion-list-header>
      <ion-item *ngFor="let category of categoriesArray" (click)="changeFilter(category, categoriesObj[category].checked)">
        <ion-label>{{categoriesObj[category].name[language]}}</ion-label>
        <ion-checkbox [(ngModel)]="categoriesObj[category].checked"></ion-checkbox>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  private categoriesObj;
  private categoriesArray;
  private language;

  constructor(public viewCtrl: ViewController) {
    this.categoriesObj = globalVariables.categoriesObj;
    this.categoriesArray = Object.keys(this.categoriesObj);
    this.language = globalVariables.language;
  }

  changeFilter(category_name, checked)
  {
    globalVariables.setSelectedCategories(category_name, checked);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}


import {Pipe} from '@angular/core';
 
@Pipe({
  name: 'filterArray'
})
export class FilterArray {
  transform(announcements, categories) {
    let selectedCategories = [];
    for (let key in categories) {
      if(categories[key].checked)
      {
        selectedCategories.push(key);
      }
    } 

    let filtered = [];
    for (let key in announcements)
    {
      if(selectedCategories.indexOf(announcements[key].category) >= 0)
      {
        filtered.push(announcements[key]);
      }
    }
    return filtered;
  }
}
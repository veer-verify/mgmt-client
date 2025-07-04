import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string): any {
    if (!items) return [];
    if (!searchText) return items;
    return items.filter((item) => Object.keys(item).some((key) => String(item[key]).toLowerCase().includes(searchText.toLowerCase())));
  }
}

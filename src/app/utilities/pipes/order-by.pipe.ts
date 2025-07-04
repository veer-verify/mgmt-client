import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<any>, field: string): any {
    return array.sort((a: any, b: any) => a[field].toLowerCase() < b[field].toLowerCase() ? -1 : a[field].toLowerCase() > b[field].toLowerCase() ? 1 : 0);
  }

}

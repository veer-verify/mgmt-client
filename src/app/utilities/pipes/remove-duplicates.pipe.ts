import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removeDuplicates'
})
export class RemoveDuplicatesPipe implements PipeTransform {

  transform(array: Array<any>, key: string): any {
    const uniqueArray: any = [];
    const seen = new Set();

    array.forEach((item: any) => {
      const value = item[key];
      if (!seen.has(value)) {
        seen.add(value);
        uniqueArray.push(item);
      }
    });
    return uniqueArray;

    // return array.reduce((acc: any, curr: any) => {
    //   if(!acc.includes(curr[key])) {
    //     acc.push(curr);
    //   }
    //   return acc;
    // }, [])
  }

}

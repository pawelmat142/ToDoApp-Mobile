import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'last'
})
export class LastPipe implements PipeTransform {

  transform(arr: Array<any>): any {
    return arr[arr.length - 1]
  }

}

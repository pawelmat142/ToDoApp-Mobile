import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deadline'
})
export class DeadlinePipe implements PipeTransform {

  transform(value: any, arg: string): string {
    let result = '---'
    if (value) { 
      if (arg === 'date') {
        result = value.split(' - ').shift()

      } else if (arg === 'time') {
        result = value.split('-').pop()

      } else if (arg === 'full') { 
        result = value
      }
    }
    return result
  }

}

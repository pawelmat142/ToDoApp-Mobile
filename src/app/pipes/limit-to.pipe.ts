import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class LimitToPipe implements PipeTransform {

  transform(value: string, args: number) : string {
    // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    // let trail = args.length > 1 ? args[1] : '...';
    let limit = args ? args : 10;
    let trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}

@NgModule({
  declarations: [LimitToPipe],
  exports: [LimitToPipe]
})
export class LimitToPipeModule {}
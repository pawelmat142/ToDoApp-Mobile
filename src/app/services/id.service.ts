import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root',
})
export class IdService {

  constructor() {}

  generate(): string {
    const time = new Date().toString()
    return Md5.hashStr(time)
  }
}

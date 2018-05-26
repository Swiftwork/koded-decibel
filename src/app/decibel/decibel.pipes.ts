import { Pipe, PipeTransform } from '@angular/core';

import { IDecibelLevel } from './decibel.component';

@Pipe({
  name: 'decibel'
})
export class DecibelPipe implements PipeTransform {
  transform(levels: IDecibelLevel[], limit: number): any {
    return levels.filter(level => level.min <= limit);
  }
}

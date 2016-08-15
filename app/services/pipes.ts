import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'encode'
})

export class Encode implements PipeTransform {
    transform(value: any, args: any[]): any {
        return encodeURIComponent(value);
    }
}
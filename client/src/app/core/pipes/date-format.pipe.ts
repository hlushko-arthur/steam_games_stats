import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment'

@Pipe({
	name: 'dateFormat'
})

export class DateFormatPipe implements PipeTransform {
	transform(unix: number, format: string): string {
		return moment.unix(unix).format(format);
	}
}
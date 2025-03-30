import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({
	name: 'dateFormat'
})

export class DateFormatPipe implements PipeTransform {
	transform(unix: number | undefined, format?: string): string {
		if (!unix || unix < 0) {
			return '-';
		}

		if (!format) {
			format = 'MMM DD YYYY';
		}

		return moment.unix(unix).format(format);
	}
}
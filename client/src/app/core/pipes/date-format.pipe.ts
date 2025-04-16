import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({
	name: 'dateFormat',
	standalone: true
})

export class DateFormatPipe implements PipeTransform {
	transform(unix: number | undefined, format?: string): string {
		if (!unix || unix < 0) {
			return '-';
		}

		if (!format) {
			format = 'MMM DD YYYY';
		}

		let result = '';

		if (format === 'years') {
			const now = moment();

			const date = moment.unix(unix);

			result = (now.diff(date, 'years', true)).toFixed(1);
		} else {
			moment.unix(unix).format(format);
		}

		return result;
	}
}
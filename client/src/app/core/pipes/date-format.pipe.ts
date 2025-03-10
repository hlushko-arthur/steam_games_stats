import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment'

@Pipe({
	name: 'dateFormat'
})

export class DateFormatPipe implements PipeTransform {
	transform(unix: number | undefined, format: string): string {
		if (!unix) {
			return '';
		}

		return moment.unix(unix).format(format);
	}
}
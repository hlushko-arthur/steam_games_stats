import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'timeFormat'
})

export class TimeFormatPipe implements PipeTransform {
	transform(time: number): string {
		if (!time) {
			return '';
		}

		const h = Math.floor(time / 60);

		const m = Math.floor(time % 60);

		let result = '';

		if (h) {
			result = `${h}h ${m}m`;
		} else {
			result = `${m}m`;
		}

		return result;
	}
}
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

		const m = time % 60;

		let _time = '';

		if (h) {
			_time = `${h}h ${m}m`;
		} else {
			_time = `${m}m`
		}

		return _time;
	}
}
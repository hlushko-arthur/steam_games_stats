import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'timeFormat',
	standalone: true
})

export class TimeFormatPipe implements PipeTransform {
	transform(time: number, type?: 'h' | 'hm'): string {
		if (!time) {
			return '';
		}

		const h = Math.floor(time / 60);

		const m = Math.floor(time % 60);

		let result = '';

		if (type === 'h') {
			result = `${(time / 60).toFixed(1)}h`;
		} else if (type === 'hm' || !type) {
			if (h) {
				result = `${h}h ${m}m`;
			} else {
				result = `${m}m`;
			}
		}

		return result;
	}
}
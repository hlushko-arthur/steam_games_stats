import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: 'timeFormat'
})

export class TimeFormatPipe implements PipeTransform {
	transform(time: number): string {
		const h = Math.floor(time / 60);

		const m = time % 60;

		return `${h}h ${m}m`;
	}
}
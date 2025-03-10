import { KeyValue } from "@angular/common";
import { AfterViewInit, Component, Input } from "@angular/core";
import { CoreModule } from "src/app/core/core.module";
import { StatsChart } from "src/app/core/interfaces/stats.interface";

@Component({
	selector: 'chart',
	templateUrl: './chart.component.html',
	styleUrl: './chart.component.scss',
	standalone: true,
	imports: [CoreModule]
})

export class ChartComponent implements AfterViewInit {
	@Input() chartData!: StatsChart;

	@Input() sort: 'decreasing' | 'increasing' = 'increasing';

	isChartLoaded: boolean = false;

	constructor() { }

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.isChartLoaded = true;
		}, 100);
	}

	sortChartOrder = (a: KeyValue<string, StatsChart[string]>, b: KeyValue<string, StatsChart[string]>): number => {
		const aKey = Number(a.key.split('-')[0] ?? a.key);
		const bKey = Number(b.key.split('-')[0] ?? b.key);

		if (this.sort === 'increasing') {
			return aKey < bKey ? -1 : (bKey < aKey ? 1 : 0);
		} else {
			return aKey > bKey ? -1 : (bKey > aKey ? 1 : 0);
		}
	}
}
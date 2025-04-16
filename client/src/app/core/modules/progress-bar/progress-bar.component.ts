import { Component, ContentChild, Input, OnInit, TemplateRef } from "@angular/core";
import { ProgressBarTitleDirective } from "./progress-bar.directive";

@Component({
	selector: 'w-progress-bar',
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss'
})

export class ProgressBarComponent implements OnInit {
	@ContentChild(ProgressBarTitleDirective, { read: TemplateRef }) titleTemplate?: TemplateRef<unknown>;

	@Input() fill?: number = 0;

	@Input() value?: number;

	@Input() maxValue?: number;

	@Input() height = 6;

	@Input() title?: string;

	progressValue = 0;

	ngOnInit(): void {
		if (this.value !== undefined && this.maxValue === undefined) {
			 throw new Error('[ProgressBarComponent] `maxValue` is required when `value` is set.');
		} else if (this.maxValue !== undefined && this.value === undefined) {
			throw new Error('[ProgressBarComponent] `value` is required when `maxValue` is set.');
		}

		if (this.fill) {
			this.progressValue = this.fill;
		} else if (this.value && this.maxValue) {
			this.progressValue = this.value / this.maxValue * 100;
		}
	}
}
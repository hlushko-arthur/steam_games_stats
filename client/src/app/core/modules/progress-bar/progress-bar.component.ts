import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { Fill } from "./progress-bar.interface";
import { ProgressBarTitleDirective } from "./progress-bar.directive";

@Component({
	selector: 'w-progress-bar',
	templateUrl: './progress-bar.component.html',
	styleUrl: './progress-bar.component.scss'
})

export class ProgressBarComponent {
	@ContentChild(ProgressBarTitleDirective, { read: TemplateRef }) titleTemplate?: TemplateRef<unknown>;

	@Input() fill: Fill = 0;

	@Input() height = 6;

	@Input() title = '127 out of 154 games played';
}
import { Directive, TemplateRef } from "@angular/core";

@Directive({
	selector: 'ng-template[w-progress-bar-title]'
})
export class ProgressBarTitleDirective {
	constructor(public template: TemplateRef<unknown>) {}
}
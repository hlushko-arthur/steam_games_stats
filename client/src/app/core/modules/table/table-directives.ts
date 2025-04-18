import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
	selector: 'ng-template[w-table-body]'
})
export class TableBodyDirective {
	constructor(public template: TemplateRef<unknown>) {}
}

@Directive({
	selector: 'ng-template[w-table-custom]'
})
export class CustomTdDirective {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	@Input() 'w-table-custom': any;

	constructor(public template: TemplateRef<unknown>) {}
}
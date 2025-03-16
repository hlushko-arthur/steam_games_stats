import { Directive, TemplateRef } from '@angular/core';

@Directive({
	selector: 'ng-template[w-table-body-list]',
})
export class TableBodyListDirective {
	constructor(public template: TemplateRef<unknown>) {
		console.log(template);
		
	}
}

@Directive({
	selector: 'ng-template[w-table-body-cards]',
})
export class TableBodyCardsDirective {
	constructor(public template: TemplateRef<unknown>) {
		console.log(template);
		
	}
}
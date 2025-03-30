import { AfterContentInit, Component, ContentChild, ContentChildren, Input, OnChanges, QueryList, signal, SimpleChanges, TemplateRef } from "@angular/core";
import { TableHeaders } from "./table.interface";
import { CustomTdDirective, TableBodyDirective } from "./table-directives";

@Component({
	selector: 'wTable',
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss',
})

export class TableComponent implements AfterContentInit, OnChanges {
	@ContentChild(TableBodyDirective, { read: TemplateRef }) bodyList!: TemplateRef<unknown>;

	@ContentChildren(CustomTdDirective) customTds!: QueryList<CustomTdDirective>;

	@Input() headers!: TableHeaders;

	@Input() items: any = [];

	@Input() height: string | number = '100%';

	customComponents: Record<string, TemplateRef<unknown>> = {};

	sort = {
		by: signal(''),
		descending: true
	};

	ngAfterContentInit(): void {
		for (const header of this.headers) {
			if (header.default) {
				this.sort.by.set(header.sortKey);

				break;
			}
		}

		for (const component of this.customTds) {
			this.customComponents[component['w-table-custom']] = component.template;
		}		
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['items'].currentValue) {
			this.items = changes['items'].currentValue;
		}
	}

	sortTable(key: string): void {
		this.sort.by.update((value) => {
			if (value === key) {
				this.sort.descending = !this.sort.descending;
			} else {
				this.sort.descending = true;
			}

			return key;
		});
	}
	
	getTableHeight(): string {
		if (typeof this.height === 'number' || !Number.isNaN(Number(this.height))) {
			return `${this.height}px`;
		}

		return this.height;
	}
}
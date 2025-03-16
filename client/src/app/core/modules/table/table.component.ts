import { Component, ContentChild, Input, signal, TemplateRef } from "@angular/core";
import { TableHeader, ViewMode } from "../../interfaces/table.interface";
import { TableBodyCardsDirective, TableBodyListDirective } from "./table-directives";

@Component({
	selector: 'wTable',
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss',
})

export class TableComponent {
	@ContentChild(TableBodyListDirective, { read: TemplateRef }) bodyList!: TemplateRef<unknown>;

	@ContentChild(TableBodyCardsDirective, { read: TemplateRef }) bodyCards!: TemplateRef<unknown>;

	@Input() header!: TableHeader[];

	@Input() viewMode: ViewMode = 'list';

	sort = {
		by: signal('lastPlayed'),
		descending: true
	};

	constructor() {
		setTimeout(() => {
			console.log(this.bodyList);
			
		}, 1000);
	}

	sortGames(key: string): void {
		this.sort.by.update((value) => {
			if (value === key) {
				this.sort.descending = !this.sort.descending;
			} else {
				this.sort.descending = true;
			}

			return key;
		});
	}
}
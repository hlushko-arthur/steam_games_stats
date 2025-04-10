import { Component, Input } from "@angular/core";
import { MiniTableItem } from "./mini-table.interface";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
	selector: 'w-mini-table',
	templateUrl: './mini-table.component.html',
	styleUrl: './mini-table.component.scss',
	standalone: true,
	imports: [CommonModule, FormsModule]
})
export class MiniTableComponent {
	@Input() items!: MiniTableItem[];

	@Input() title = '';

	@Input() set width(value: string | number) {
		if (!Number.isNaN(Number(value))) {
			this._width = `${value}px`;
		} else {
			this._width = value as string;
		}
	}

	get width(): string {
		return this._width;
	}

	private _width = 'min-content';

	constructor() {
		console.log(this.items);
		
	}

	// isLine(item: MiniTableItem): item is Line {
	// 	return 'line' in item;
	// }

	// isItem(item: MiniTableItem): item is Item {
	// 	return 'title' in item;
	// }
}
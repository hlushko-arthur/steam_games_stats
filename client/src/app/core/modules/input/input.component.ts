import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

type InputIcon = 'search';

@Component({
	selector: 'w-input',
	templateUrl: './input.component.html',
	styleUrl: './input.component.scss',
	standalone: true,
	imports: [FormsModule]
})
export class InputComponent {
	@Input() title = '';

	@Input() iconType?: InputIcon;

	@Input() set width(value: string) {
		if (value) {
			if (!Number.isNaN(Number(value))) {
				this._width = `${value}px`;
			} else {
				this._width = value;
			}
		}
	}

	get width(): string {
		return this._width;
	}

	@Input() model: unknown = '';

	@Output() modelChange = new EventEmitter<unknown>();

	private _width = '200px';

	@Input() placeholder = 'Type here...';

	onChangeModel(): void {
		this.modelChange.emit(this.model);
	}
}
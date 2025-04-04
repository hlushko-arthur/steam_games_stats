import { Component, Input } from "@angular/core";

@Component({
	selector: 'w-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
	@Input() id?: string;
}
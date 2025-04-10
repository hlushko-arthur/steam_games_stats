import { Component, Input } from "@angular/core";
import { ButtonType } from "./button.interface";

@Component({
	selector: 'w-button',
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss'
})

export class ButtonComponent {
	@Input() type: ButtonType = 'primary';
}
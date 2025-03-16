import { Component, Input } from "@angular/core";

@Component({
	selector: 'wInput',
	templateUrl: './input.component.html',
	styleUrl: './input.component.scss'
})

export class InputComponent {

	@Input() title = '';

	@Input() placeholder = 'Type here...';

}
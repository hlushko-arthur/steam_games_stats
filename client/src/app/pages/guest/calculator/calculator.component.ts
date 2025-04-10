import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "src/app/core/modules/button/button.module";
import { InputComponent } from "src/app/core/modules/input/input.component";

@Component({
	templateUrl: './calculator.component.html',
	styleUrl: './calculator.component.scss',
	standalone: true,
	imports: [FormsModule, InputComponent, ButtonModule]
})
export class CalculatorComponent {
	steamId = '';

	constructor(private _router: Router) {}

	navigateToCalculatorProfile(): void {
		this._router.navigateByUrl(`/calculator/${this.steamId}`);
	}
}
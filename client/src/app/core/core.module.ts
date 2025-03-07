import { NgModule } from "@angular/core";
import { InputComponent } from "./modules/input/input.component";
import { CommonModule } from "@angular/common";
import { DateFormatPipe } from "./pipes/date-format.pipe";
import { TimeFormatPipe } from "./pipes/time-format.pipe";

@NgModule({
	declarations: [
		InputComponent,
		DateFormatPipe,
		TimeFormatPipe
	],
	imports: [
		CommonModule,
	],
	exports: [
		InputComponent,
		CommonModule,
		DateFormatPipe,
		TimeFormatPipe
	]
})

export class CoreModule { }
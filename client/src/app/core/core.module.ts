import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateFormatPipe } from "./pipes/date-format.pipe";
import { TimeFormatPipe } from "./pipes/time-format.pipe";

@NgModule({
	declarations: [
		DateFormatPipe,
		TimeFormatPipe,
	],
	imports: [
		CommonModule,
	],
	exports: [
		CommonModule,
		DateFormatPipe,
		TimeFormatPipe,
	]
})

export class CoreModule { }
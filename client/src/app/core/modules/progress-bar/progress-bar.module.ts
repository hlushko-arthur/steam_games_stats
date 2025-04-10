import { NgModule } from "@angular/core";
import { ProgressBarComponent } from "./progress-bar.component";
import { CommonModule } from "@angular/common";
import { ProgressBarTitleDirective } from "./progress-bar.directive";

@NgModule({
	declarations: [ProgressBarComponent, ProgressBarTitleDirective],
	imports: [CommonModule],
	exports: [ProgressBarComponent, ProgressBarTitleDirective]
})

export class ProgressBarModule {}
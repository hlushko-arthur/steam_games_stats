import { NgModule } from "@angular/core";
import { DropdownComponent } from "./dropdown.component";
import { DropdownDirective } from "./dropdown.directive";

@NgModule({
	declarations: [DropdownComponent, DropdownDirective],
	imports: [],
	exports: [DropdownComponent, DropdownDirective],
})

export class DropdownModule {}
import { NgModule } from "@angular/core";
import { CustomTdDirective, TableBodyDirective } from "./table-directives";
import { TableComponent } from "./table.component";
import { CommonModule } from "@angular/common";
import { SortPipe } from "../../pipes/sort.pipe";

@NgModule({
	declarations: [TableComponent, TableBodyDirective, CustomTdDirective],
	imports: [CommonModule, SortPipe],
	exports: [TableComponent, TableBodyDirective, CustomTdDirective]
})

export class TableModule {}
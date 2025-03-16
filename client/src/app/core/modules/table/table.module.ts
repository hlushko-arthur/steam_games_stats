import { NgModule } from "@angular/core";
import { TableBodyCardsDirective, TableBodyListDirective } from "./table-directives";
import { CoreModule } from "../../core.module";
import { TableComponent } from "./table.component";

@NgModule({
	declarations: [TableComponent, TableBodyListDirective, TableBodyCardsDirective],
	imports: [CoreModule],
	exports: [TableComponent, TableBodyListDirective, TableBodyCardsDirective]
})

export class TableModule {}
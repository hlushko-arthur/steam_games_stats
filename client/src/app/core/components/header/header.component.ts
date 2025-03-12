import { Component } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { FileService } from "src/app/services/file.service";

@Component({
	selector: 'header',
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})

export class HeaderComponent {
	constructor(public us: UserService, public fs: FileService) {}
}
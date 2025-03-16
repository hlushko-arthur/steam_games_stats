import { Component } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { FileService } from "src/app/services/file.service";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'header',
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})

export class HeaderComponent {
	tab: 'profile' | 'games' | 'achievements' = 'profile';
	
	constructor(public us: UserService, public fs: FileService, private _activatedRoute: ActivatedRoute) {
		_activatedRoute.params.subscribe((params) => {
			console.log(params);
			
		});
	}
}
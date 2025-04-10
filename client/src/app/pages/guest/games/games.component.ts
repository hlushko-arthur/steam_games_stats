import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { GamesTableComponent } from "src/app/core/components/games-table/games-table.component";
import { CoreModule } from "src/app/core/core.module";
import { Game } from "src/app/core/interfaces/steam.interface";
import { InputComponent } from "src/app/core/modules/input/input.component";
import { TableViewMode } from "src/app/core/modules/table/table.interface";
import { SortPipe } from "src/app/core/pipes/sort.pipe";
import { UserService } from "src/app/services/user.service";

@Component({
	templateUrl: './games.component.html',
	styleUrl: './games.component.scss',
	standalone: true,
	imports: [CoreModule, RouterLink, SortPipe, GamesTableComponent, InputComponent],
})

export class GamesComponent implements OnInit {	
	viewMode: TableViewMode = 'list';

	games: Game[] = [];

	constructor(private _us: UserService, private _activatedRoute: ActivatedRoute, private _router: Router) { }

	async ngOnInit(): Promise<void> {
		const steamId = this._activatedRoute.snapshot.paramMap.get('steamId');

		if (!steamId) {
			this._router.navigateByUrl('/');

			return;
		}

		if (Object.keys(this._us.userData).length) {
			this.games = this._us.userData.games;

			return;
		}

		const profile = await this._us.fetch({
			steamId: steamId
		});

		if (!profile) {
			return;
		} 

		this.games = profile.games;
	}
}
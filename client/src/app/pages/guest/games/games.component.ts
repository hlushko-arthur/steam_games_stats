import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CoreModule } from "src/app/core/core.module";
import { Game } from "src/app/core/interfaces/steam.interface";
import { FileService } from "src/app/services/file.service";
import { UserService } from "src/app/services/user.service";

@Component({
	templateUrl: './games.component.html',
	styleUrl: './games.component.scss',
	standalone: true,
	imports: [CoreModule, RouterLink]
})

export class GamesComponent implements OnInit {
	games: Game[] = [];

	constructor(public fs: FileService, private _us: UserService, private _activatedRoute: ActivatedRoute, private _router: Router) { }

	async ngOnInit(): Promise<void> {
		const steamId = this._activatedRoute.snapshot.paramMap.get('steamId');

		if (!steamId) {
			this._router.navigateByUrl('/');
			return;
		}

		const { games } = await this._us.fetchProfile(steamId);

		this.games = games;
	}

	getCompletionNumber(game: Game): number {
		return Math.floor(game.achievementsUnlocked / game.achievements.length * 100);
	}
}
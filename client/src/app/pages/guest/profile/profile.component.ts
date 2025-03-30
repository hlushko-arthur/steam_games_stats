import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CoreModule } from "src/app/core/core.module";
import { Game } from "src/app/core/interfaces/steam.interface";
import { User } from "src/app/core/interfaces/steam.interface";
import { FileService } from "src/app/services/file.service";
import { StatsService } from "src/app/services/stats.service";
import { UserService } from "src/app/services/user.service";
import { ChartComponent } from "./chart/chart.component";
import { GameService } from "src/app/services/game.service";

@Component({
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	standalone: true,
	imports: [CoreModule, ChartComponent, RouterLink]
})

export class ProfileComponent implements OnInit {
	games: Game[] = [];

	user: User = {} as User;

	activeChart: 'games' | 'achievements' = 'games';

	steamId!: string;

	constructor(
		public stats: StatsService,
		public fs: FileService,
		public gs: GameService,
		private _us: UserService,
		private _activatedRoute: ActivatedRoute,
		private _router: Router
	) {
		const steamId = _activatedRoute.snapshot.paramMap.get('steamId');

		if (!steamId) {
			this._router.navigateByUrl('/');

			return;
		}

		this.steamId = steamId;
	}

	async ngOnInit(): Promise<void> {
		this._loadUserData();
	}

	private async _loadUserData(): Promise<void> {
		if (Object.keys(this._us.userData).length) {
			this.games = this._us.userData.games;

			this.user = this._us.userData.user;

			return;
		}

		const { games, user } = await this._us.fetchProfile(this.steamId);

		this.gs.setGames(games);

		this.stats.calculateStats(games);

		Object.assign(this, { games, user });
	}
}
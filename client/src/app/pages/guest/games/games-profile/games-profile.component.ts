import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CoreModule } from "src/app/core/core.module";
import { Game } from "src/app/core/interfaces/steam.interface";
import { TableHeaders } from "src/app/core/modules/table/table.interface";
import { TableModule } from "src/app/core/modules/table/table.module";
import { FileService } from "src/app/services/file.service";
import { GameService } from "src/app/services/game.service";
import { UserService } from "src/app/services/user.service";

@Component({
	templateUrl: './games-profile.component.html',
	styleUrl: './games-profile.component.scss',
	standalone: true,
	imports: [CoreModule, TableModule]
})

export class GamesProfileComponent implements OnInit {
	game!: Game;

	firstUnlockDate = -1;

	lastUnlockDate = -1;

	timeBetween = -1;

	players: any = [];

	constructor(
		public fs: FileService,
		private _us: UserService,
		private _gs: GameService,
		private _activatedRoute: ActivatedRoute,
	) {}

	async ngOnInit(): Promise<void> {
		const appId = Number(this._activatedRoute.snapshot.paramMap.get('appId'));

		const steamId = this._activatedRoute.snapshot.paramMap.get('steamId') as string;

		if (Object.keys(this._us.userData).length) {
			this.game = this._us.userData.games.find((game) => game._id === appId) as Game;

			return;
		}

		const game = await this._gs.fetch(appId, steamId);

		if (!game) {
			return;
		}

		this.game = game;

		this.players = await this._gs.getPlayersStats(appId);

		this.players.push(...new Array(4).fill(this.players[0]));

		console.log(this.players);
		
		console.log('game', this.game);

		this._processGame();
		
	}

	private _processGame(): void {
		this.firstUnlockDate = this.game.achievements.reduce(
			(unix: number, achievement) => {
				if (!achievement.unlockTime) {
					return unix;
				}

				return achievement.unlockTime < unix ? achievement.unlockTime : unix;
			},
			Date.now()
		) || -1;		

		this.lastUnlockDate = this.game.achievements[0].unlockTime || -1;

		this.timeBetween = (this.lastUnlockDate - this.firstUnlockDate) / 60;		
	}

	readonly TABLE_PLAYERS_HEADER: TableHeaders = [
		{
			title: 'Player',
			sortKey: 'name'
		}, {
			title: 'Completion',
			sortKey: 'completion',
			default: true
		}, {
			title: 'Achievements',
			sortKey: 'achievementsUnlocked'
		}, {
			title: 'Playtime',
			sortKey: 'playtime'
		}
	];

	readonly TABLE_ACHIEVEMENTS_HEADER: TableHeaders = [
		{
			title: 'Achievement',
			sortKey: 'displayName'
		}, {
			title: 'Unlock Date',
			sortKey: 'unlockTime',
			default: true
		},
		{
			title: 'Global Unlocks',
			sortKey: 'rarity'
		}
	];
}
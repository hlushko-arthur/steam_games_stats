import { Component } from "@angular/core";
import { CoreModule } from "src/app/core/core.module";
import { Achievement, UserAchievement, Game } from "src/app/core/interfaces/steam.interface";
import { User } from "src/app/core/interfaces/steam.interface";
import { FileService } from "src/app/services/file.service";
import { SteamService } from "src/app/services/steam.service";

@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	standalone: true,
	imports: [CoreModule]
})

export class DashboardComponent {
	readonly STEAM_ID = '76561199470822799';

	achievements: Achievement[] = [];
	userAchievements: UserAchievement[] = [];
	games: Game[] = [];
	user: User = {} as User;

	constructor(public fs: FileService, private _ss: SteamService) { }

	async ngOnInit(): Promise<void> {
		this._loadUserData();
	}

	getCompletionNumber(game: Game): number {
		console.log('get');
		
		return game.userAchievements.length / game.achievements.length * 100;
	}

	private async _loadUserData(): Promise<void> {
		const { games, user } = await this._ss.fetchUserData(this.STEAM_ID);

		this.games = games;
		this.user = user;

		games.forEach((game) => {
			this.achievements.push(...game.achievements);
			this.userAchievements.push(...game.userAchievements);
		})

		this._sortGames();
		console.log(this.games);
	}

	private _sortGames(): void {
		this.games = this.games.sort((a, b) => {
			if(a.lastDatePlayed < b.lastDatePlayed) {
				return 1;
			}

			return -1;
		})
	}
}
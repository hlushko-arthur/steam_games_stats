import { Component, Input, signal } from "@angular/core";
import { Game } from "../../interfaces/steam.interface";
import { FileService } from "src/app/services/file.service";
import { CoreModule } from "../../core.module";
import { SortPipe } from "../../pipes/sort.pipe";
import { TableViewMode } from "../../modules/table/table.interface";
import { RouterLink } from "@angular/router";

@Component({
	selector: 'games-table',
	templateUrl: './games-table.component.html',
	styleUrl: './games-table.component.scss',
	standalone: true,
	imports: [CoreModule, SortPipe, RouterLink]
})

export class GamesTableComponent {
	@Input() games: Game[] = [];

	@Input() viewMode: TableViewMode = 'list';

	constructor(public fs: FileService) {}

	sort = {
		by: signal('lastPlayed'),
		descending: true
	};
	
	sortGames(key: string): void {
		this.sort.by.update((value) => {
			if (value === key) {
				this.sort.descending = !this.sort.descending;
			} else {
				this.sort.descending = true;
			}

			return key;
		});
	}

	readonly tableHeader = [{
		name: 'Game',
		sort: 'name'
	},
	{
		name: 'Completion',
		sort: 'completion'
	},
	{
		name: 'Achievements',
		sort: 'achievements.length'
	},
	{
		name: 'Playtime',
		sort: 'playtime'
	},
	{
		name: 'Recent Playtime',
		sort: 'recentPlaytime'
	},
	{
		name: 'Last Played',
		sort: 'lastPlayed'
	},
	{
		name: 'Game Rating',
		sort: 'review.rating'
	},
	{
		name: 'Review Score',
		sort: 'review.score'
	},
	{
		name: 'Developer',
		sort: 'developer'
	}];
}
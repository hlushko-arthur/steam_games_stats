import { Component, OnInit } from "@angular/core";
import { MiniTableComponent } from "src/app/core/modules/mini-table/mini-table.component";
import { ProgressBarModule } from "src/app/core/modules/progress-bar/progress-bar.module";

@Component({
	templateUrl: './calculator-profile.component.html',
	styleUrl: './calculator-profile.component.scss',
	standalone: true,
	imports: [ProgressBarModule, MiniTableComponent]
})
export class CalculatorProfileComponent implements OnInit {

	// con;

	ngOnInit(): void {
		
	}

	gamesByCost = [
		{
			title: '$55.00 and higher',
			value: 3
		},
		{
			title: '$40.00 - $54.99',
			value: 5
		},
		{
			title: '$25.00 - $39.99',
			value: 33
		},
		{
			title: '$10.00 - $24.99',
			value: 42
		},
		{
			title: '$6.00 - $9.99',
			value: 17
		},
		{
			title: '$2.00 - $5.99',
			value: 30
		},
		{
			title: '$0.01 - $1.99',
			value: 10
		},
		{
			title: 'No price',
			value: 18
		},
	];

	gamesByPlaytime = [
		{
			title: '1000 or more hours',
			value: 1
		},
		{
			title: '500-1000 hours',
			value: 1
		},
		{
			title: '200-500 hours',
			value: 3
		},
		{
			title: '100 - 200 hours',
			value: 15
		},
		{
			title: '50 - 100 hours',
			value: 15
		},
		{
			title: '25 - 50 hours',
			value: 15
		},
		{
			title: '10 - 25 hours',
			value: 15
		},
		{
			title: '5 - 10 hours',
			value: 15
		},
		{
			title: '3 - 5 hours',
			value: 15
		},
		{
			title: '2 - 3 hours',
			value: 15
		},
		{
			title: '1 -2 hours',
			value: 15
		},
		{
			title: '0 - 1 hours',
			value: 15
		},
		{
			title: 'Never played',
			value: 28
		},
	];

	badges = [
		{
			title: 'Special badges',
			value: 7
		},
		{
			title: 'Normal badges',
			value: 26
		},
		{
			title: 'Foil badges',
			value: 0
		},
		{
			title: 'Level 1',
			value: 9
		},
		{
			title: 'Level 2',
			value: 1
		},
		{
			title: 'Level 3',
			value: 0
		},
		{
			title: 'Level 4',
			value: 0
		},
		{
			title: 'Level 5',
			value: 16
		},
		{
			title: 'Level 6 and higher',
			value: 0
		}
	];

	profileCustomizations = [
		{
			title: 'Background',
			value: 'Rogue AI'
		},
		{
			title: 'Mini profile',
			value: 'Rogue AI'
		},
		{
			title: 'Avatar frame',
			value: 'Oil'
		},
		{
			title: 'Animated avatar',
			value: 'The trio of death'
		},
	];

	bans = [
		{
			title: 'Game bans',
			value: 'In good standing'
		},
		{
			title: 'VAC bans',
			value: 'In good standing'
		},
		{
			title: 'Community ban',
			value: 'In good standing'
		},
		{
			title: 'Trade ban',
			value: 'In good standing'
		},
	];
}
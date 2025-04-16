import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";

@Component({
	selector: 'w-steam-level',
	templateUrl: './steam-level.component.html',
	styleUrl: './steam-level.component.scss',
	standalone: true,
})
export class SteamLevelComponent implements AfterViewInit {
	@ViewChild('levelWrapper') levelElement!: ElementRef<unknown>;


	@Input() level!: number;

	levels: {min: number; max: number; color: string}[] = [
		{ min: 0, max: 10, color: '#B72D46' },
		{ min: 11, max: 20, color: '#C84E2A' },
		{ min: 21, max: 30, color: '#F6CA3E' },
		{ min: 31, max: 40, color: '#4B723F' },
		{ min: 41, max: 50, color: '#5589CB' },
		{ min: 51, max: 60, color: '#6C4FAF' },
		{ min: 61, max: 70, color: '#BC55C0' },
		{ min: 71, max: 80, color: '#4A2B35' },
		{ min: 81, max: 90, color: '#8C7759' }
	  ];

	ngAfterViewInit(): void {
		const element = this.levelElement.nativeElement as HTMLElement;

		element.style.setProperty('border-color', this._getLevelColor());

		element.style.setProperty('box-shadow', `inset 0px 0px 4px ${this._getLevelColor()}`);
	}

	private _getLevelColor(): string {
		return this.levels.find(({min, max}) => this.level > min && this.level <= max)?.color || '#B72D46';
	}
}
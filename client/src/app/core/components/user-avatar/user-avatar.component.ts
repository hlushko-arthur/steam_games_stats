import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FileService } from "src/app/services/file.service";

@Component({
	selector: 'w-user-avatar',
	templateUrl: './user-avatar.component.html',
	styleUrl: './user-avatar.component.scss',
	standalone: true
})

export class UserAvatarComponent implements AfterViewInit {
	@ViewChild('avatarWrapper') avatarElement!: ElementRef<unknown>;

	@Input() avatar!: string;

	@Input() frame!: string;

	@Input() size? = 48;

	constructor(public fs: FileService) {}

	ngAfterViewInit(): void {
		const element = this.avatarElement.nativeElement as HTMLElement;

		element.style.setProperty('width', `${this.size}px`);

		element.style.setProperty('height', `${this.size}px`);
	}
}
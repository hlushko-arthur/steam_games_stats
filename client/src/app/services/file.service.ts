import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})

export class FileService {

	readonly appDomain = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps';

	readonly avatarDomain = 'https://avatars.steamstatic.com';

	file(appId: number, icon: string): string {
		return `${this.appDomain}/${appId}/${icon}.jpg`
	}

	avatar(icon: string, size?: 'medium' | 'full'): string {
		return `${this.avatarDomain}/${icon}${size ? '_' + size : ''}.jpg`;
	}

	gameHeader(appId: number): string {
		return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`
	}
}
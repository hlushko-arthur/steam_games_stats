import { Injectable } from "@angular/core";

@Injectable({
	providedIn: 'root'
})

export class FileService {

	readonly appDomain = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps';

	// readonly avatarDomain = 'https://avatars.steamstatic.com';

	readonly avatarDomain = 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ac';

	readonly profileDomain = 'https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/';

	file(appId: number, icon: string): string {
		return `${this.appDomain}/${appId}/${icon}.jpg`;
	}

	avatar(icon: string, size?: 'medium' | 'full'): string {
		const extension = icon.split('.')[1];

		icon = icon.split('.')[0];

		return `${this.profileDomain}/${icon}${size ? '_' + size : ''}.${extension}`;
	}

	gameHeader(appId: number): string {
		return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
	}

	profileBackground(path: string): string {
		return `${this.profileDomain}/${path}`;
	}

	gameBackgroundV6(appId: number): string {
		return `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/page_bg_generated_v6.jpg`;
	}
}
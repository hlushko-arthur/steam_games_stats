import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/guest/profile/profile.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/guest/login/login.component';
import { HeaderComponent } from './core/components/header/header.component';
import { GamesComponent } from './pages/guest/games/games.component';
import { GamesProfileComponent } from './pages/guest/games/games-profile/games-profile.component';
const routes: Routes = [
	{
		path: 'profile/:steamId',
		component: ProfileComponent
	},
	{
		path: 'profile/:steamId/games',
		component: GamesComponent
	},
	{
		path: 'profile/:steamId/games/:appId',
		component: GamesProfileComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: '**',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	},
];

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent,
	],
	imports: [
		ProfileComponent,
		BrowserModule,
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			preloadingStrategy: PreloadAllModules
		})
	],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent]
})
export class AppModule { }

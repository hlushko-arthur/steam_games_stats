import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PreloadAllModules, RouterLink, RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/guest/profile/profile.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/guest/login/login.component';
import { HeaderComponent } from './core/components/header/header.component';
import { GamesComponent } from './pages/guest/games/games.component';
import { GamesProfileComponent } from './pages/guest/games/games-profile/games-profile.component';
import { DashboardComponent } from './pages/guest/dashboard/dashboard.component';
import { GuestGuard } from './core/guards/guest.guard';

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
		component: LoginComponent,
		canActivate: [GuestGuard]
	},
	{
		path: 'dashobard',
		component: DashboardComponent
	},
	{
		path: '**',
		redirectTo: 'login',
		pathMatch: 'full'
	},
];

@NgModule({
	declarations: [
		AppComponent,
		HeaderComponent
	],
	imports: [
		RouterLink,
		ProfileComponent,
		BrowserModule,
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled',
			preloadingStrategy: PreloadAllModules
		})
	],
	providers: [provideHttpClient(), GuestGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }

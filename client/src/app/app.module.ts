import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/guest/profile/profile.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './pages/guest/login/login.component';
import { HeaderComponent } from './core/components/header/header.component';
const routes: Routes = [
	{
		path: 'profile/:steamId',
		component: ProfileComponent
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
		HeaderComponent
	],
	imports: [
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

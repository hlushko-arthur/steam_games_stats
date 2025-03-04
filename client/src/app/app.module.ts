import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent
	},
	{
		path: '**',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}
];

@NgModule({
	declarations: [
		AppComponent,
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

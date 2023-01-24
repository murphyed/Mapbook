import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { PlacesComponent } from './places/places.component';
import { SearchComponent } from './search/search.component';
import { PlacesLivedComponent } from './places/places-lived/places-lived.component';
import { PlacesVisitedComponent } from './places/places-visited/places-visited.component';
import { RouteReuseStrategy } from '@angular/router';
import { CacheRouteReuseStrategy } from './shared/utils/cache-route-reuse.strategy';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewUserFormComponent,
    NavbarComponent,
    PlacesComponent,
    SearchComponent,
    PlacesLivedComponent,
    PlacesVisitedComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CacheRouteReuseStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

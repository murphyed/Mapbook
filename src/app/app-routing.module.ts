import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { PlacesLivedComponent } from './places/places-lived/places-lived.component';
import { PlacesVisitedComponent } from './places/places-visited/places-visited.component';
import { PlacesComponent } from './places/places.component';
import { SearchComponent } from './search/search.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

const routes: Routes = [
  { path: '', redirectTo: '/new-user-form', pathMatch: 'full' },
  { path: 'new-user-form', component: NewUserFormComponent },
  { path: 'search', component: SearchComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'navbar', component: NavbarComponent },
  {
    path: 'places',
    component: PlacesComponent,
    children: [
      {
        path: 'places-lived',
        component: PlacesLivedComponent,
      },
      {
        path: 'places-visited',
        component: PlacesVisitedComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

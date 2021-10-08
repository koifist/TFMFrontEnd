import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AssetsComponent } from './assets/assets.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { IncidentDetailComponent } from './incident-detail/incident-detail.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'userManage', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'assets', component: AssetsComponent },
  { path: 'incidents', component: IncidentsComponent },
  { path: 'incidentDetail', component: IncidentDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

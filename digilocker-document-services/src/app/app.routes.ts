import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { SignupComponent } from '../pages/signup/signup.component';
import { PanRequestComponent } from '../pages/pan-request/pan-request.component';
import { ProfileComponent } from '../pages/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'pan-request', component: PanRequestComponent },
    { path: 'profile', component: ProfileComponent },

    { path: '**', redirectTo: 'home' }
];

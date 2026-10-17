import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth.guard';
import { AuthService } from './services/auth.service';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { TimetableComponent } from './timetable/timetable.component';
import { ScheduleExamComponent } from './schedule-exam/schedule-exam.component';
import { NotificationPopupComponent } from './notification-popup/notification-popup.component';
import { MainpageComponent } from './mainpage/mainpage.component';


export const routes: Routes = [
  { path: 'dashboard', component: LandingPageComponent },
  {path: '', component: MainpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'timetable', component: TimetableComponent },
  { path: 'create-account', component: LoginComponent },
  { path: 'exam-manager', component: ScheduleExamComponent },
  { path: 'notification-popup', component: NotificationPopupComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  
  // Wildcard route to handle any undefined paths
  {
    path: '**',
    redirectTo: '', // Redirect to login page if no current user
    pathMatch: 'full',
    canActivate: [AuthGuard], // CanActivate guard will decide the redirection
  },
];

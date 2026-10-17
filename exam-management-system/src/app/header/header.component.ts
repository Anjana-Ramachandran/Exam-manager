import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { MatIconModule } from '@angular/material/icon'; 
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog'; 
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule
  ], // Import necessary Angular modules directly in the component
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  userName!: string;  // Declare the userName property
  isLoggedIn$: Observable<boolean>;  // Observable to track user login status

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.isLoggedIn$ = this.authService.currentUser$.pipe(
      map(user => {
        if (user) {
          this.userName = user.userName;  // Set the userName if the user is logged in
          return true;
        }
        return false;
      })
    );
  }

  // Logout method to clear the session and navigate to the home page
  logout(): void {
    this.authService.logout();
    this.router.navigate(['']); // Redirect to home
    this.userName = '';
    this.snackBar.open('You have been logged out!', '', { duration: 3000 });
  }

  // Navigate to the home page
  navigateToHome(): void {
    this.router.navigate(['']); // Navigate to the home page
  }

  // Navigate to the login page
  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to the login page
  }

  // Navigate to the timetable page for exam information
  navigateToTimetable(): void {
    this.router.navigate(['/timetable']); // Navigate to the timetable page
  }

  // Open the Notifications popup
  openNotifications(): void {
    this.dialog.open(NotificationPopupComponent, {
      // width: '400px',
      // height: '300px',
      data: {
        title: 'Exam Notifications',  // Title of the notification
        messages: [
          'Exam registration open.',
          'Timetable released for 6th-semester students.',
          'Lab internal exams scheduled.',
        ],
      },
    });
  }
}

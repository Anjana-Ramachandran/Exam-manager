import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // For two-way binding
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    HttpClientModule, // Add HttpClientModule here
  ],
  providers: [
    MatSnackBar,  // Added MatSnackBar provider explicitly
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userId: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onLogin() {
    if (this.userId && this.password) {
      this.authService.login(this.userId, this.password).subscribe({
        next: (response) => {
          this.showSnackbar('Login successful!', 'success');
          // Navigate based on user role
          const user = this.authService.getCurrentUser();
          if (user) {
            switch (user.role) {
              case 'Admin':
                // this.router.navigate(['/admin-dashboard']);
                this.router.navigate(['home'])
                break;
              case 'Faculty':
                // this.router.navigate(['/faculty-dashboard']);
                this.router.navigate(['home'])
                break;
              case 'Student':
                // this.router.navigate(['/student-dashboard']);
                this.router.navigate(['home'])
                break;
            }
          }
        },
        error: (error) => {
          this.showSnackbar(
            error.error?.error || 'An error occurred during login.',
            'error'
          );
        }
      });
    } else {
      this.showSnackbar('Please fill in both User ID and Password.', 'error');
    }
  }

  private showSnackbar(message: string, type: 'success' | 'error' | 'warning') {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}

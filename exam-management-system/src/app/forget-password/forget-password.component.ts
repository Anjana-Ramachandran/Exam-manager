import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],providers: [
      MatSnackBar,  // Added MatSnackBar provider explicitly
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      }
    ],
})
export class ForgetPasswordComponent {
  constructor(private authService: AuthService, private snackBar: MatSnackBar){

  }
  email: string = '';

  obtainPassword(): void {
    if (this.email) {
      this.authService.retrievePassword(this.email).subscribe({
        next: () => {
          this.showSnackbar('Password sent to email', 'success');
        },
        error: (err) => {
          console.error('Error retrieving password:', err);
          this.showSnackbar('Failed to send password. Please try again.', 'error');
        }
      });
    } else {
      this.showSnackbar('Please enter a valid email ID.', 'error');
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent {
  // Form properties
  userId: string = '';
  email: string = '';
  otp: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'Student'; // Default role

  // State flags
  isOtpSent: boolean = false;
  isVerified: boolean = false;
  isLoading: boolean = false;
  isEmailValid: boolean = true;

  // API base URL - Update this with your backend's URL
  private apiUrl = 'http://localhost:8000/api'; // Update with your backend URL

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router) {}

  // Utility method for displaying snack bar messages
  private showMessage(message: string, action: string = 'Close', duration: number = 3000) {
    this.snackBar.open(message, action, { duration });
  }

  validateEmail(): void {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.isEmailValid = emailRegex.test(this.email);
  }

  // Send OTP to the user's email
  sendOtp() {
    if (!this.userId || !this.email) {
      this.showMessage('Please fill in all fields');
      return;
    }

    this.isLoading = true;
    this.http.post(`${this.apiUrl}/send-otp`, { userId: this.userId, email: this.email }).subscribe({
      next: (response: any) => {
        this.isOtpSent = true;
        this.showMessage(response.message || 'OTP sent successfully!');
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Failed to send OTP');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Verify the entered OTP
  verifyOtp() {
    if (!this.otp) {
      this.showMessage('Please enter OTP');
      return;
    }

    this.isLoading = true;
    this.http.post(`${this.apiUrl}/verify-otp`, { userId: this.userId, otp: this.otp }).subscribe({
      next: (response: any) => {
        if (response.valid) {
          this.isVerified = true;
          this.showMessage('OTP verified successfully!');
        } else {
          this.showMessage('Invalid OTP');
        }
      },
      error: (error) => {
        this.showMessage(error.error?.message || 'Failed to verify OTP');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  // Create the user account
  createAccount() {
    if (!this.userId || !this.password || !this.confirmPassword) {
      this.showMessage('Please fill in all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showMessage('Passwords do not match!');
      return;
    }

    this.isLoading = true;

    // First create/set password
    this.http
      .post(`${this.apiUrl}/create-password`, {
        userId: this.userId,
        password: this.password,
        retypePassword: this.confirmPassword,
      })
      .subscribe({
        next: (response) => {
          // Success: Show success message and route to login page
          this.showMessage('Successfully activated your account');
          this.router.navigate(['login']); // Navigate to login page
        },
        error: (error) => {
          // Error: Show error message
          this.showMessage(error.error?.message || 'Failed to set password');
          this.isLoading = false;
        },
      });
  }

  // Reset form fields and state
  private resetForm() {
    this.userId = '';
    this.email = '';
    this.otp = '';
    this.username = '';
    this.password = '';
    this.confirmPassword = '';
    this.role = 'Student';
    this.isOtpSent = false;
    this.isVerified = false;
  }
}

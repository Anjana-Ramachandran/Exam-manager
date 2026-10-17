import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface User {
  userId: string;
  userName: string;
  role: 'Admin' | 'Student' | 'Faculty';
  phoneNumber: string;
  emailId: string;
  token?: string;
}

export interface BulkCreationResponse {
  message: string;
  results: {
    successful: User[];
    failed: Array<{
      userId: string;
      error: string;
    }>;
  };
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  createBulkUsers(users: Partial<User>[]): Observable<BulkCreationResponse> {
    return this.http.post<BulkCreationResponse>(`${this.apiUrl}/create-account`, users);
  }

  login(userId: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { userId, password })
      .pipe(
        tap(response => {
          if (response.user && response.token) {
            const user: User = {
              ...response.user,
              token: response.token
            };
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  sendOtp(userId: string, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-otp`, { userId, email });
  }
  retrievePassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  verifyOtp(userId: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { userId, otp });
  }

  createPassword(userId: string, password: string, retypePassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-password`, {
      userId,
      password,
      retypePassword
    });
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.currentUserSubject.value?.token ?? null;
  }
  getAllUsers(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: {
        Authorization: `Bearer ${token}` // Pass the token for authentication
      }
    });
  }

}
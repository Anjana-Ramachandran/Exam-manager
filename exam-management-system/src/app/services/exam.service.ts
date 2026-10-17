import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface ExamDetail {
  createdBy: string;
  userId: string;
  block: string;
  room: string;
  seat: string;
  examDateTime: Date;
  attendance: 'Y' | 'N';
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {}

  addExamDetails(examDetails: ExamDetail[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-exam-details`, examDetails);
  }

  scheduleExam(examData: any, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(`${this.apiUrl}/add-exam-details`, examData, { headers });
  }

  editExam(examData: any, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(`${this.apiUrl}/edit-exam-details`, examData, { headers });
  }
  // registerForExam(examData: any, authToken: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${authToken}`
  //   });
  //   return this.http.post(`${this.apiUrl}/register-for-exam`, examData, { headers });
  // }

  registerForExam(payload: { userId: string; subjectCodes: string[] }, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}/register-for-exam`, payload, { headers });
  }

  getExamDetails(userId: string, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return this.http.get<any>(`${this.apiUrl}/get-exam-details/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }
  
  getExamRegistrationDetails(userId: string, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });
  
    const payload = { userId }; // Sending userId in the request body
  
    return this.http.post<any>(`${this.apiUrl}/get-exam-reg-details`, payload, { headers })
      .pipe(catchError(this.handleError));
  }
  
  getExamCountDetails(userId: string, authToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    return this.http.get<any>(`${this.apiUrl}/get-exam-count-details/${userId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  addAttendance(seatDetails: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/reg-exam-attendace`, seatDetails);
  }

  // Centralized error handling
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  markAttendance(attendanceData: {
    userId: string;
    block: string;
    room: string;
    attendance: Array<{ userId: string; attendance: 'Y' | 'N' }>;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/mark-attendance`, attendanceData);
  }
  submitFeedback(feedbackData: { userId: string; feedback: string }, token: string): Observable<any> {
    const url = `${this.apiUrl}/feedback`; // Use the correct endpoint
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(url, feedbackData, { headers })
      .pipe(
        catchError(this.handleError) // Handle errors
      );
    }
    getFeedback(): Observable<any> {
      const url = `${this.apiUrl}/view-feedback`;
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      });
    
      return this.http.get(url, { headers });
    }
}

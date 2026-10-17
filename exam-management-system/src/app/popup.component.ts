import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from './services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import {
  MatDatetimepickerModule,
  MatNativeDatetimeModule,
} from '@mat-datetimepicker/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ExamService } from './services/exam.service';
import { ChangeDetectorRef } from '@angular/core';
export interface PopupData {
  title: string;
  type: 'createUsers' | 'feedback' | 'help' | 'attendance' | 'scheduleExam' | 'registerExam' | 'viewFeedback' | 'viewUsers';
}

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    NgxMatTimepickerModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [
    { provide: 'ngx-mat-timepicker-options', useValue: { hour12: true } },
  ],
  styles: [
    `
      .table-container {
        width: 100%;
        overflow-x: auto;
        margin-top: 1rem;
      }

      .mat-mdc-dialog-content {
        max-height: 70vh;
        overflow-x: auto;
      }

      table {
        min-width: 600px; /* Adjust this value based on your table content */
      }
      .exam-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
    `,
  ],
  template: `
    <h2 mat-dialog-title *ngIf="data.type !== 'viewFeedback'">{{ data.title }}</h2>
    <div mat-dialog-content>
      <div [ngSwitch]="data.type">
        <div *ngSwitchCase="'createUsers'">
          <input
            type="file"
            #fileInput
            accept=".csv"
            style="display: none"
            (change)="onFileSelected($event)"
          />
          <button mat-raised-button color="primary" (click)="fileInput.click()">
            Upload CSV
          </button>
          <div *ngIf="uploadedUsers.length > 0" class="mt-4">
            <h3>Preview:</h3>
            <table mat-table [dataSource]="uploadedUsers" class="w-full">
              <ng-container matColumnDef="userId">
                <th mat-header-cell *matHeaderCellDef>User ID</th>
                <td mat-cell *matCellDef="let user">{{ user.userId }}</td>
              </ng-container>
              <ng-container matColumnDef="userName">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let user">{{ user.userName }}</td>
              </ng-container>
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef>Role</th>
                <td mat-cell *matCellDef="let user">{{ user.role }}</td>
              </ng-container>
              <ng-container matColumnDef="phoneNumber">
                <th mat-header-cell *matHeaderCellDef>Phone Number</th>
                <td mat-cell *matCellDef="let user">{{ user.phoneNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let user">{{ user.emailId }}</td>
              </ng-container>
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef>Departement</th>
                <td mat-cell *matCellDef="let user">{{ user.department }}</td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
            </table>
          </div>
        </div>
    
      <div *ngSwitchCase="'viewFeedback'">
      <h2>View Feedback</h2>
      <!-- Loading Text -->
      <p *ngIf="isLoading">Loading feedback...</p>
      <!-- Feedback Table -->
      <table mat-table [dataSource]="feedbackList" *ngIf="!isLoading && feedbackList.length > 0" class="mat-elevation-z8">
        <ng-container matColumnDef="userId">
          <th mat-header-cell *matHeaderCellDef>User ID</th>
          <td mat-cell *matCellDef="let feedback">{{ feedback.userId }}</td>
        </ng-container>
        <ng-container matColumnDef="feedback">
          <th mat-header-cell *matHeaderCellDef>Feedback</th>
          <td mat-cell *matCellDef="let feedback">{{ feedback.feedback }}</td>
        </ng-container>
        <ng-container matColumnDef="createdAt">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let feedback">{{ feedback.createdAt | date: 'medium' }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="['userId', 'feedback', 'createdAt']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['userId', 'feedback', 'createdAt']"></tr>
      </table>
      <!-- No Feedback Message -->
      <p *ngIf="!isLoading && feedbackList.length === 0">No feedback available.</p>
    </div>
          <div *ngSwitchCase="'viewUsers'">
  <h2>View Users</h2>
  <div *ngIf="isLoading">Loading users...</div>
  <div *ngIf="!isLoading && users.length > 0">
    <table mat-table [dataSource]="users" class="mat-elevation-z8">
      <!-- User ID Column -->
      <ng-container matColumnDef="userId">
        <th mat-header-cell *matHeaderCellDef>User ID</th>
        <td mat-cell *matCellDef="let user">{{ user.userId }}</td>
      </ng-container>

      <!-- Name Column -->
      <ng-container matColumnDef="userName">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let user">{{ user.userName }}</td>
      </ng-container>

      <!-- Email Column -->
      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef>Email</th>
        <td mat-cell *matCellDef="let user">{{ user.emailId }}</td>
      </ng-container>

      <!-- Phone Number Column -->
      <ng-container matColumnDef="phoneNumber">
        <th mat-header-cell *matHeaderCellDef>Phone Number</th>
        <td mat-cell *matCellDef="let user">{{ user.phoneNumber }}</td>
      </ng-container>

      <!-- Role Column -->
      <ng-container matColumnDef="role">
        <th mat-header-cell *matHeaderCellDef>Role</th>
        <td mat-cell *matCellDef="let user">{{ user.role }}</td>
      </ng-container>
      <ng-container matColumnDef="department">
        <th mat-header-cell *matHeaderCellDef>Department</th>
        <td mat-cell *matCellDef="let user">{{ user.department }}</td>
      </ng-container>

      <!-- Header and Row Definitions -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  </div>
  <div *ngIf="!isLoading && users.length === 0">
    <p>No users found.</p>
  </div>
</div>
        <div *ngSwitchCase="'feedback'">
          <h2>Submit Feedback</h2>
          <mat-form-field class="w-full">
            <textarea matInput placeholder="Enter your feedback" [(ngModel)]="feedbackText"></textarea>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="submitFeedback()">Submit</button>
        </div>
        <div *ngSwitchCase="'registerExam'">
          <mat-form-field class="w-full" style="width: 400px;">
            <mat-label>Select the subject</mat-label>
            <mat-select [(ngModel)]="selectedSubjects" placeholder="Select subjects" multiple>
              <mat-option *ngFor="let subject of subjects" [value]="subject.subjectCode">
                {{ subject.subjectCode }} - {{ subject.subjectName }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>
        <div *ngSwitchCase="'scheduleExam'" class="exam-form">
          <!-- <app-schedule-exam></app-schedule-exam> -->
        </div>
        <div *ngSwitchCase="'help'">
  <mat-accordion>
    <!-- 1. How do I create an account? -->
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>How do I create an account?</mat-panel-title>
      </mat-expansion-panel-header>
      <p>
        To create an account, click on the "Sign Up" button on the login page. 
        Fill in all required details including your student ID, email, and password. 
        Verify your email through the link sent to your inbox to complete registration.
      </p>
    </mat-expansion-panel>

    <!-- 2. How do I sign in to my account? -->
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>How do I sign in to my account?</mat-panel-title>
      </mat-expansion-panel-header>
      <p>
        Visit the login page and enter your registered user ID or email and password. 
        Click the "Sign In" button to access your dashboard. 
        If you've forgotten your password, use the "Forgot Password" option.
      </p>
    </mat-expansion-panel>

    <!-- 3. How do I register for exams? -->
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>How do I register for exams?</mat-panel-title>
      </mat-expansion-panel-header>
      <p>
        Navigate to the "Exam Registration" section in your dashboard. 
        Select the semester and available subjects you wish to register for. 
        Review your selection and submit. You'll receive a confirmation email once your registration is approved.
      </p>
    </mat-expansion-panel>

    <!-- 4. Where can I check my exam schedule? -->
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>Where can I check my exam schedule?</mat-panel-title>
      </mat-expansion-panel-header>
      <p>
        Your exam schedule is available in the <strong>"Exam Timetable"</strong> section of your dashboard. 
        It displays the date, time, venue, and subject code for all your registered exams. 
        The timetable is shown directly on the website, so you can easily view it without needing to download any files.
      </p>
    </mat-expansion-panel>

    <!-- 10. How do I update my contact information? -->
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title>How do I update my contact information?</mat-panel-title>
      </mat-expansion-panel-header>
      <p>
        To update your contact information, go to "My Profile" and select "Edit Profile." 
        Update your phone number, email, or address as needed and click "Save Changes." 
        Some changes may require verification before they take effect.
      </p>
    </mat-expansion-panel>
  </mat-accordion>
</div>
      </div>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button 
  mat-raised-button 
  *ngIf="data.type !== 'help' && data.type !== 'feedback' && data.type !== 'viewFeedback' && data.type !== 'viewUsers'" 
  color="primary" 
  (click)="onSubmit()">
        Submit
      </button>
    </div>
  `,
})
export class PopupComponent {
  uploadedUsers: any[] = [];
  displayedColumns: string[] = [
    'userId',
    'userName',
    'role',
    'phoneNumber',
    'email',
    'department'
  ];
  examData = {
    subjectName: '',
    examDate: null,
    startTime: '',
    endTime: '',
  };

  private dialogRef = inject(MatDialogRef<PopupComponent>);
  public data = inject<PopupData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  examForm!: FormGroup;
  token!: any;
  userId: any;

  // NEW CODE: Declare feedbackText and submitFeedback inside the class
  feedbackText: string = '';
  feedbackList: any[] = []; // Array to store feedback data
  isLoading = false; // Loading state

  // NEW CODE: Add properties for "View Users"
  users: any[] = []; // Array to store fetched users
  displayedColumnsUsers: string[] = ['userId', 'userName', 'email', 'phoneNumber', 'role','department']; // Columns for the users table

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private examService: ExamService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.initializeForm();
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.userId;
        this.token = user.token;
      }
    });
  }
  form = new FormGroup({
    subject: new FormControl(),
  });

  selectedSubject: string | null = null;
  selectedSubjects: string[] = [];
 
  subjects = [
    { subjectCode: 'ENG1A01', subjectName: 'TRANSACTIONS – ESSENTIAL ENGLISH LANGUAGE SKILLS' },
    { subjectCode: 'ENG1A02', subjectName: 'WAYS WITH WORDS – LITERATURES IN ENGLISH' },
    { subjectCode: 'BCA1B01', subjectName: 'Computer Fundamentals & HTML' },
    { subjectCode: 'BCA1C02', subjectName: 'Discrete Mathematics' },
    { subjectCode: 'BCA3B04', subjectName: 'Data Structures using C' },
    { subjectCode: 'BCM1B01', subjectName: 'Business Management' },
    { subjectCode: 'STA3C12', subjectName: 'Stochastic Processes' },
  ];

  private initializeForm(): void {
    this.examForm = this.fb.group({
      subjectName: ['', Validators.required],
      examDate: [null, Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csvData = reader.result as string;
        this.uploadedUsers = this.parseCSV(csvData);
        console.log(this.uploadedUsers);
      };
    }
  }

  parseCSV(csv: string): any[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map((header) => header.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(',').map((value) => value.trim());
      const user: any = {};

      headers.forEach((header, index) => {
        user[header] = values[index];
      });
      console.log("users",user);
      return {
        userId: user.userId,
        userName: user.userName,
        password: user.password,
        role: user.role,
        phoneNumber: user.phoneNumber,
        emailId: user.emailId,
        department:user.department

      };
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.data.type === 'scheduleExam') {
      // Validate exam data
      if (
        !this.examData.subjectName ||
        !this.examData.examDate ||
        !this.examData.startTime ||
        !this.examData.endTime
      ) {
        this.snackBar.open('Please fill in all required fields', 'Close', {
          duration: 3000,
        });
        return;
      }

      // Here you would typically call a service to schedule the exam
      this.dialogRef.close(this.examData);
    } else if (
      this.data.type === 'createUsers' &&
      this.uploadedUsers.length > 0
    ) {
      // Existing createUsers submission logic
    } else {
      this.dialogRef.close();
    }
    if (this.data.type === 'createUsers' && this.uploadedUsers.length > 0) {
      this.authService.createBulkUsers(this.uploadedUsers).subscribe({
        next: (response) => {
          const successCount = response.results.successful.length;
          const failedCount = response.results.failed.length;

          let message = `Successfully created ${successCount} users.`;
          if (failedCount > 0) {
            message += ` Failed to create ${failedCount} users.`;
          }

          this.snackBar.open(message, 'Close', { duration: 5000 });

          // If there are failures, log them for admin review
          if (failedCount > 0) {
            console.log('Failed entries:', response.results.failed);
          }

          this.dialogRef.close(response);
        },
        error: (error) => {
          this.snackBar.open(
            'Error creating users. Please try again.',
            'Close',
            {
              duration: 5000,
            }
          );
          console.error('Bulk creation error:', error);
        },
      });
    } else {
      this.dialogRef.close();
    }

    if (this.data.type === 'registerExam') {
      const payload = {
        userId: this.userId, 
        subjectCodes: this.selectedSubjects
      };

      this.examService.registerForExam(payload, this.token).subscribe({
        next: (response: any) => {
          this.snackBar.open('Exam registered successfully!', 'Close', { duration: 3000 });
        },
        error: (error: any) => {
          this.snackBar.open(error.error.message || 'Failed to register for exam', 'Close', { duration: 3000 });
        }
      });
    }
  }

  // NEW CODE: submitFeedback method
  submitFeedback(): void {
    // Check if feedback text is not empty
    if (this.feedbackText.trim()) {
      const feedbackData = {
        userId: this.userId,  // Ensure this.userId is set appropriately
        feedback: this.feedbackText
      };

      // Call the service method to submit feedback
      this.examService.submitFeedback(feedbackData, this.token).subscribe({
        next: (response: any) => {
          // Display success message
          this.snackBar.open('Feedback submitted successfully!', 'Close', { duration: 3000 });
          this.feedbackText = ''; // Clear the textarea
        },
        error: (error: any) => {
          // Display error message
          this.snackBar.open('Failed to submit feedback', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Feedback cannot be empty', 'Close', { duration: 3000 });
    }
  }
  ngOnInit(): void {
    if (this.data.type === 'viewFeedback') {
      this.fetchFeedback(); // Fetch feedback when the component initializes
    } else if (this.data.type === 'viewUsers') {
      this.fetchUsers(); // Fetch users when the component initializes
    }
  }
  
  fetchFeedback(): void {
    this.isLoading = true;
    this.examService.getFeedback().subscribe({
      next: (response) => {
        this.feedbackList = response.feedback;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to fetch feedback. Please try again.', 'Close', { duration: 3000 });
        this.isLoading = false;
        console.error('Error fetching feedback:', error);
      }
    });
  }
  fetchUsers(): void {
    this.isLoading = true;
    this.authService.getAllUsers(this.token).subscribe({ // Pass the token
      next: (response: any) => {
        this.users = response; // Populate the users array
        this.isLoading = false;
        this.cdr.detectChanges(); // Trigger change detection
      },
      error: (error) => {
        this.isLoading = false;
        this.snackBar.open('Failed to fetch users', 'Close', { duration: 3000 });
        console.error('Error fetching users:', error);
      },
    });
  }
}
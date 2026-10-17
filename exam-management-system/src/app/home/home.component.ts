import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { ExamService } from '../services/exam.service';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PopupComponent } from '../popup.component';
import { OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; // Import for mat-slide-toggle
import { FormsModule } from '@angular/forms'; // Import for [(ngModel)]
export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

export interface ExamDetails {
  userId: string;
  userName: string;
  seat: string;
  createdBy: string;
  block: string;
  room: string;
  examDateTime: string;
  attendance: string;
}

export interface ExamDetailsForStudent {
  examDate: string;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  semester: string;
  courseId: string;
  blockId: string;
}


@Component({
  selector: 'app-home',
  imports: [MatDialogModule, MatCardModule, MatChipsModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,CommonModule,MatSlideToggleModule,FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [
    MatSnackBar, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
})
export class HomeComponent {

  userName!: string;
  userRole!: string;
  userId!: string;
  token!: any;
  // displayedColumns: string[] = ['userId', 'userName', 'seat', 'createdBy', 'block', 'room', 'examDateTime', 'attendance'];
  displayedColumns: string[] = ['userId', 'userName', 'subjects', 'semester', 'courseId', 'seats'];
  displayedColumns2: string[] = ['examDate', 'startTime', 'endTime', 'subjectCode','subjectName', 'semester', 'courseId', 'blockId', 'seat','room'];
  displayedColumns3: string[] = ['userId', 'userName', 'subjects', 'semester', 'courseId', 'seats', 'attendance'];
  dataSource!: MatTableDataSource<ExamDetails>;
  dataSource2!: MatTableDataSource<ExamDetailsForStudent>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private authService: AuthService, private examService:ExamService, private snackBar: MatSnackBar, private router: Router,  private cdr: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<ExamDetails>();
  }
  
  ngOnInit() {
    //fetch user data from service file
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userName = user.userName;
        this.userRole = user.role;
        this.userId = user.userId;
        this.token = user.token;
    this.fetchStudentDetails();
        if(this.userRole === 'Admin'){
          this.fetchStudentDetails();
        }
        this.fetchExamDetails();
      } else {
        // Handle case where user is not logged in
        this.userName = '';
        this.userRole = '';
      }
    });
  
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchStudentDetails() {
    this.examService.getExamCountDetails(this.userId, this.token).subscribe({
      next: (response: any) => {
        this.dataSource = response.data; // Populate table with API response
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to fetch exam details:', error);
        this.snackBar.open('Error fetching exam details', 'Close', {
          duration: 3000,
        });
      },
    });
  }
  fetchExamDetails() {
    this.examService.getExamRegistrationDetails(this.userId, this.token).subscribe({
      next: (response: any) => {
        this.dataSource2 = response.examDetails; // Populate table with API response
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to fetch exam details:', error);
        this.snackBar.open('Error fetching exam details', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  markAttendance(element: any): void {
    console.log('Marking attendance for:', element);
  
    if (!element.seats || element.seats.length === 0) {
      console.warn('No seat details available for this user.');
      return;
    }
  
    // Pick only the first seat
    const firstSeat = element.seats[0];
  
    const seatDetails = [{
      blockId: firstSeat.blockId,
      room: firstSeat.room,
      seat: firstSeat.seat
    }];
  
    this.examService.addAttendance(seatDetails).subscribe({
      next: (response) => {
        console.log('Attendance updated successfully:', response)
        this.snackBar.open('Attendance updated successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (error) => {
        console.error('Error updating attendance:', error)
        this.snackBar.open('Error while updating attendance', 'Close', {
          duration: 3000,
        });
      }
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openPopup(type: string): void {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '600px',
      data: {
        title: this.getPopupTitle(type),
        type: type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && type === 'createUsers') {
        console.log('Uploaded users:', result);
        // Handle the uploaded users data
      }
    });
  }

  goToExmMngr(){
    this.router.navigate(['exam-manager']);
  }

  private getPopupTitle(type: string): string {
    const titles: { [key: string]: string } = {
      createUsers: 'Create Users',
      feedback: 'Add Feedback',
      help: 'Help Center',
      attendance: 'Add Attendance',
      scheduleExam: 'Schedule Exam',
      registerExam: 'Register Exam'
    };
    return titles[type] || 'Popup';
  }
  contactAdmin(): void {
    const email = 'exammanager58@gmail.com';
    const subject = 'Support Request';
    const body = 'Hello Admin, I need assistance with...'; // Customize the body as needed

    // Construct the Gmail URL
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open Gmail in a new tab
    window.open(gmailUrl, '_blank');
  }
}


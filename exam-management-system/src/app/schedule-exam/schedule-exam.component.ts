import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ExamService } from '../services/exam.service';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth.service';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import moment from 'moment';
interface ExamUploadData {
  examDate: string;
  startTime: string;
  endTime: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  courseId: string;
  blockId: string;
  room: string;
  seat: string;
}

@Component({
  selector: 'app-exam-schedule',
  templateUrl: './schedule-exam.component.html',
  styleUrls: ['./schedule-exam.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatSnackBarModule,
    MatIconModule,
    NgxMaterialTimepickerModule
  ]
})
export class ScheduleExamComponent implements OnInit {
  uploadedFileName: string = '';
  uploadedTimeTable: ExamUploadData[] = [];
  displayedColumns: string[] = [
    'examDate', 
    'startTime', 
    'endTime', 
    'subjectCode', 
    'subjectName', 
    'semester', 
    'courseId', 
    'blockId', 
  ];
  loading = false;
  userRole: any;
  userId: any;
  token: any;
  getTimeTable: any;

  editMode = false;
  originalTimeTable: any[] = [];
  editedTimeTable: any[] = [];

  constructor(
    private examService: ExamService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    //fetch user data from service file
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userRole = user.role;
        this.userId = user.userId;
        this.token = user.token;
      }
    });

    this.fetchExamDetails();
  }

  fetchExamDetails(): void {
    this.loading = true; // Start loading indicator
  
    this.examService.getExamDetails(this.userId, this.token).subscribe({
      next: (response) => {
        if (response && response.records) {
          // Clone original data to maintain reference for cancel operation
          this.originalTimeTable = JSON.parse(JSON.stringify(response.records));
  
          // Create an editable version of the data
          // this.editedTimeTable = response.records.map((record: any) => ({
          //   ...record,
          //   examDate: record.examDate ? moment(record.examDate).format('DD MMM YYYY') : '', // Format date properly
          // }));

          this.editedTimeTable = response.records.map((user:any) => ({
            ...user,
            examDate: user.examDate ? new Date(user.examDate) : null
          }));
  
          // Bind editable data to table
          this.getTimeTable = JSON.parse(JSON.stringify(this.editedTimeTable));
        } else {
          this.getTimeTable = [];
          this.originalTimeTable = [];
          this.editedTimeTable = [];
        }
      },
      error: (error) => {
        console.error('Error fetching exam details:', error);
        this.snackBar.open(error.message || 'Failed to fetch exam details', 'Close', { duration: 3000 });
      },
      complete: () => {
        this.loading = false; // Stop loading indicator
      },
    });
  }  

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFileName = file.name;
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csvData = reader.result as string;
        this.uploadedTimeTable = this.parseCSV(csvData);
      };
    }
  }

  parseCSV(csvData: string): ExamUploadData[] {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const result: ExamUploadData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentLine = lines[i].split(',');

      if (currentLine.length === headers.length) {
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].trim()] = currentLine[j].trim();
        }
        
        // Convert semester to number
        obj.semester = parseInt(obj.semester, 10);
        
        result.push(obj);
      }
    }

    return result;
  }

  submitExamSchedule(): void {
    if (this.uploadedTimeTable.length === 0) {
      this.snackBar.open('Please upload a CSV file first', 'Close', { duration: 3000 });
      return;
    }

    this.loading = true;
    const examData = this.uploadedTimeTable.map(user => ({
      examDate: user.examDate,
      startTime: user.startTime,
      endTime: user.endTime,
      createdBy: this.userId,
      subjectCode: user.subjectCode,
      subjectName: user.subjectName,
      semester: user.semester,
      courseId: user.courseId,
      blockId: user.blockId
    }));

    this.examService.scheduleExam(examData, this.token).subscribe({
      next: () => {
        this.snackBar.open('Exam scheduled successfully!', 'Close', { duration: 3000 });
        this.fetchExamDetails();
        this.resetForm();
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to schedule exam', 'Close', { duration: 5000 });
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  resetForm(): void {
    this.uploadedFileName = '';
    this.uploadedTimeTable = [];
  }

  toggleEditMode() {
    this.editMode = true;
  }

  cancelChanges() {
    this.editedTimeTable = JSON.parse(JSON.stringify(this.originalTimeTable)); // Restore original
    this.editMode = false;
  }

  saveChanges() {
    const examData = this.editedTimeTable.map(user => ({
      examDate: user.examDate ? new Date(user.examDate.setHours(12, 0, 0, 0)) : null,
      startTime: user.startTime,
      endTime: user.endTime,
      createdBy: this.userId, 
      subjectCode: user.subjectCode,
      subjectName: user.subjectName,
      semester: user.semester,
      courseId: user.courseId,
      blockId: user.blockId
    }));

    this.examService.editExam(examData,this.token).subscribe({
      next: () => {
        this.snackBar.open('Exam updated successfully!', 'Close', { duration: 3000 });
        this.fetchExamDetails();
        this.editMode = false;
      },
      error: (error) => {
        this.snackBar.open(error.message || 'Failed to schedule exam', 'Close', { duration: 5000 });
      }
    });
  }

  addRow() {
    this.editedTimeTable = [
      ...this.editedTimeTable,
      {
        examDate: '',
        startTime: '',
        endTime: '',
        subjectCode: '',
        subjectName: '',
        semester: '',
        courseId: '',
        blockId: ''
      }
    ];
  }
  
  removeRow(index: number) {
    this.editedTimeTable = this.editedTimeTable.filter((_, i) => i !== index);
  }
  
}
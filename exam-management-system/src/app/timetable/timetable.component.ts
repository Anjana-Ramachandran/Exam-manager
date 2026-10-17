import { Component, OnInit } from '@angular/core';
import { ExamService } from '../services/exam.service';
import moment from 'moment';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-timetable',
  standalone: true,
  providers: [],
  imports: [MatSnackBarModule, CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatTableModule],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  userId!: string;
  token!: string;
  getTimeTable: any = [];
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
  dataSource!: MatTableDataSource<any>;

  constructor(private examService: ExamService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchExamDetails();
  }

  fetchExamDetails() {
    this.examService.getExamDetails(this.userId, this.token).subscribe({
      next: (response) => {
        this.getTimeTable = response.records.map((record: any) => {
          // Format examDate using moment
          record.examDate = moment(record.examDate).format('DD MMM YYYY');
          return record;
        });
        this.dataSource = new MatTableDataSource(this.getTimeTable);  // Initialize dataSource with fetched data
      },
      error: (error) => {
        this.snackBar.open('Error fetching exam details', 'Close', {
          duration: 3000,
        });
        console.error('Error fetching exam details', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

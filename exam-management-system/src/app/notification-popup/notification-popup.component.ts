import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
export interface PopupData {
  title: string;
  type: 'createUsers' | 'feedback' | 'help' | 'attendance' | 'scheduleExam';
  messages: string[];
}

@Component({
  selector: 'app-notification-popup',
  standalone: true, // Standalone component
  imports: [MatDialogModule,CommonModule], // Import Angular Material dialog module
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css'],
})
export class NotificationPopupComponent {
  public data = inject<PopupData>(MAT_DIALOG_DATA); // Use `inject` to get the dialog data

  constructor(public dialogRef: MatDialogRef<NotificationPopupComponent>) {}

  closePopup(): void {
    this.dialogRef.close(); // Close the dialog
  }
}

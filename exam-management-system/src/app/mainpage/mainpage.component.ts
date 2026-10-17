import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router to enable navigation
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent {
  
  constructor(private router: Router) {}
  footerVisible: boolean = true;

  navigateToLandingPage() {
    this.router.navigate(['/dashboard']); // Navigates to the 'another-page' route
  }
}

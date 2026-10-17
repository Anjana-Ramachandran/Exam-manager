import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Needed for the ngIf, etc.
import { HeaderComponent } from './header/header.component';  // Import HeaderComponent
import { FooterComponent } from './footer/footer.component'; 
import { FloatingAnimationComponent } from './floating-animation/floating-animation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent, FooterComponent, FloatingAnimationComponent], // Make sure CommonModule is imported to use common directives
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'exam-management-system';
}

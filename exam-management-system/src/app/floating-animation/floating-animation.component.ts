import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-floating-animation',
  imports: [],
  templateUrl: './floating-animation.component.html',
  styleUrl: './floating-animation.component.css'
})
export class FloatingAnimationComponent {
  objects: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.createObjects();
    this.animate();
  }

  createObjects() {
    for (let i = 0; i < 10; i++) {
      this.objects.push(new FloatingObject('book'));
    }
    for (let i = 0; i < 8; i++) {
      this.objects.push(new FloatingObject('notebook'));
    }
    for (let i = 0; i < 5; i++) {
      this.objects.push(new FloatingObject('laptop'));
    }
  }

  animate() {
    this.objects.forEach(obj => obj.update());
    requestAnimationFrame(() => this.animate());
  }

  @HostListener('window:resize')
  onResize() {
    this.objects.forEach(obj => obj.reset());
  }
}

class FloatingObject {
  element: HTMLElement;
  x!: number;
  y!: number;
  speedX!: number;
  speedY!: number;
  rotation!: number;
  scale!: number;

  constructor(type: string) {
    this.element = document.createElement('div');
    this.element.className = `floating-object ${type}`;

    if (type === 'laptop') {
      const screen = document.createElement('div');
      screen.className = 'laptop-screen';
      const keyboard = document.createElement('div');
      keyboard.className = 'laptop-keyboard';
      this.element.appendChild(screen);
      this.element.appendChild(keyboard);
    }

    this.reset();
    document.getElementById('animation-container')?.appendChild(this.element);
  }

  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = window.innerHeight + 50;
    this.speedX = (Math.random() - 0.5) * 1;
    this.speedY = -Math.random() * 1 - 1;
    this.rotation = Math.random() * 360;
    this.scale = 0.8 + Math.random() * 0.3;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.y < -100 || this.x < -100 || this.x > window.innerWidth + 100) {
      this.reset();
    }

    this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg) scale(${this.scale})`;
  }
}

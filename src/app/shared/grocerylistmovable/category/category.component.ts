import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      (click)="handleClick()" 
      (mouseenter)="hovering = true" 
      (mouseleave)="hovering = false"
    >
      {{text + ' ' + pointer}}
    </span>
  `,
  styles: ``
})
export class CategoryComponent {
  @Input() text: string;
  @Output() pressedEvent = new EventEmitter<{name: string, dir: "ASC" | "DESC"}>;
  
  hovering: boolean = false;
  pressed: boolean = false;
  direction: "ASC" | "DESC" = "ASC";

  handleClick() {
    this.pressed = !this.pressed;
    this.direction = this.direction == "ASC" ? "DESC" : "ASC";
    this.pressedEvent.emit({name: this.text, dir: this.direction});
  }

  get pointer() {
    if (!this.hovering && !this.pressed) return '';
    return this.direction == "ASC" ? "˅" : "˄";
  }
}

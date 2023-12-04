import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GrocerylistComponent } from './shared/grocerylist/grocerylist.component';
import { HttpClientModule } from '@angular/common/http';
import { GrocerylistmovableComponent } from './shared/grocerylistmovable/grocerylistmovable.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    imports: [CommonModule, RouterOutlet, NavbarComponent, GrocerylistComponent, HttpClientModule, GrocerylistmovableComponent]
})
export class AppComponent {
  title = 'Groceries';
  constructor(private modalService: NgbModal) {
  }
  public open(modal: any): void {
    this.modalService.open(modal);
  }
}

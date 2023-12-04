import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroceryList } from '../../grocery-list';

@Component({
  selector: 'app-grocerylist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grocerylist.component.html',
  styleUrl: './grocerylist.component.css'
})
export class GrocerylistComponent {
  @Input({required: true}) list!: GroceryList
}

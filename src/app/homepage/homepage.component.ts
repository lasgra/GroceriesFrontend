import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrocerylistComponent } from '../shared/grocerylist/grocerylist.component';
import { GroceryList } from '../grocery-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, GrocerylistComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  constructor(private router: Router) { }
  AccountList: GroceryList[] = [
    {
      name: "Account",
      groceryEntries: [{
        id: 1,
        name: "Login",
        price: 10.99,
        amount: 1,
        category: "a",
        unit: "w"
      }]
    }
  ]
  GroceryLists: GroceryList[] = [
    {
      name: "Grocery Lists",
      groceryEntries: [{
        id: 1,
        name: "Your Lists",
        price: 6.98,
        amount: 0,
        category: "a",
        unit: "w"
      }]
    }
  ]
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event: Event): void {
    var reveal = document.querySelectorAll(".reveal")
    reveal.forEach(element => {
      var windowHeight = window.innerHeight
      var elementTop = element.getBoundingClientRect().top
      var elementVisible = 150

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
    });
    document.body.style.setProperty(
      "--scroll", (window.scrollY*1.35 /(document.body.scrollHeight - window.innerHeight)-0.001).toString()
    );
  }
  navigate(route : string){
    this.router.navigate([route])
  }
}

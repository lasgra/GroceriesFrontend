import { Component,Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroceryList } from '../../grocery-list';
import { ListsComponent } from '../../lists/lists.component';
import { CategoryComponent } from "./category/category.component";

@Component({
    selector: 'app-grocerylistmovable',
    standalone: true,
    templateUrl: './grocerylistmovable.component.html',
    styleUrl: './grocerylistmovable.component.css',
    imports: [CommonModule, CategoryComponent]
})
export class GrocerylistmovableComponent {
  constructor(
    private listComponent: ListsComponent
  ) { }
  @Input({required: true}) list!: GroceryList
  @ViewChild("body") body: ElementRef
  @ViewChild("id") id: CategoryComponent;
  @ViewChild("name") name: CategoryComponent;
  @ViewChild("price") price: CategoryComponent
  @ViewChild("HeaderName") Header: ElementRef
  @HostListener('contextmenu', ['$event'])
  onRightClick(event : Event) {
    event.preventDefault();
  }
  mousePosX: number
  mousePosY: number
  changeX: number
  changeY: number
  pressed : string = "Id"
  way: string = "ASC"
  ngOnInit(){
    setTimeout(() => {
      this.body.nativeElement.style.left = (Math.random() * (screen.width - 450)) + "px"
      this.body.nativeElement.style.top = (Math.random() * (screen.height - 800)) + "px"
    }, 0);
  }
  DragExit() {
    this.body.nativeElement.setAttribute("holding", "false")
  }
  MouseLeave(){
    this.body.nativeElement.setAttribute("holding", "false")
  }
  DragEnter(event : MouseEvent) {
    this.body.nativeElement.setAttribute("mousePos", -(event.clientX) + ", " + -(event.clientY))
    this.body.nativeElement.setAttribute("ChX", (this.body.nativeElement.style.left.split("px")[0]))
    this.body.nativeElement.setAttribute("ChY", (this.body.nativeElement.style.top.split("px")[0]))
    this.body.nativeElement.setAttribute("holding", "true")
  }
  MouseMove(event : MouseEvent){
    if(this.body.nativeElement.getAttribute("holding") == "true"){
      this.mousePosX = parseInt(this.body.nativeElement.getAttribute("mousePos")!.split(", ")[0])
      this.mousePosY = parseInt(this.body.nativeElement.getAttribute("mousePos")!.split(", ")[1])
      this.body.nativeElement.style.left = (parseInt(this.body.nativeElement.getAttribute("ChX")!) + event.clientX + this.mousePosX) + "px"
      this.body.nativeElement.style.top = (parseInt(this.body.nativeElement.getAttribute("ChY")!) + event.clientY + this.mousePosY) + "px"
    }
  }
  SetBackground(category : string){
    switch (category) {
      case "Fruit":
        return "rgba(50, 161, 50, 0.2)"
      case "Vegetable":
        return "rgba(201, 30, 30, 0.2)"
      case "Drink":
        return "rgba(29, 138, 211, 0.2)"
      case "Candy":
        return "rgba(221, 156, 16, 0.2)"
    }
    return "#ffffff00"
  }

  handlePressedEvent(child: {name: string, dir: "ASC" | "DESC"}) {
    this.id.pressed = child.name == "Id";
    this.name.pressed = child.name == "Name";
    this.price.pressed = child.name == "Price";
    this.listComponent.GetGroceries(child.dir, child.name, parseInt(this.body.nativeElement.id)).subscribe()
  }
  Clicked(event: Event){
    this.listComponent.AddGroceries(parseInt((<HTMLElement>event.target).parentNode?.firstChild?.textContent!), 1).subscribe()
  }
  RightClick(event: Event){
    this.listComponent.AddGroceries(parseInt((<HTMLElement>event.target).parentNode?.firstChild?.textContent!), -1).subscribe()
  }
}

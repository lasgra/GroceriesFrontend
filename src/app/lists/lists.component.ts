import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrocerylistmovableComponent } from '../shared/grocerylistmovable/grocerylistmovable.component';
import { GroceryList } from '../grocery-list';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GroceryEntry } from '../grocery-entry';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [CommonModule, GrocerylistmovableComponent],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent {
  @ViewChild("Main") Main : ElementRef
  @ViewChild("Popup") Popup : ElementRef
  @ViewChild("Input") Input : ElementRef
  @ViewChild("popupButton") Button : ElementRef
  @ViewChild("Drop") Drop : ElementRef
  @ViewChild("AddButton") AddButton : ElementRef
  @ViewChild("ListsText") ListsText : ElementRef
  @ViewChild("DropdownText") DropdownText : ElementRef
  @ViewChild("NotLogged") NotLogged : ElementRef
  Dropped : boolean = false
  DontDrop : boolean = false
  constructor(
    private http: HttpClient,
    private cookieService: CookieService    
    ) {}
  
  Groceries: GroceryList[] = [
    {
      id: 0,
      name: "Pick grocery!",
      groceryEntries: []
    }
  ];
  lists: GroceryList[] = []
  ngOnInit() {
    this.GetGroceries("ASC", "Id", 0).subscribe();
    if (!this.cookieService.check("Token")) {
      setTimeout(() => {
        this.NotLogged.nativeElement.classList.add("NotLoged")
        this.NotLogged.nativeElement.style.display = "flex"
      }, 2);
    }
  }
  GetGroceries(way : string, pressed : string, Id : number): Observable<HttpResponse<GroceryEntry[]>> {
    if (Id == 0){
      const headers= new HttpHeaders()
        .set('ngrok-skip-browser-warning', 'true')
      return this.http.get<GroceryEntry[]>('https://374a-89-234-249-144.ngrok-free.app/api/grocery?SortBy='+pressed+'&SortDirection='+way, { observe: 'response', headers: headers })
      .pipe(tap(response => {
        if (response.ok) {
          this.Groceries[0].groceryEntries = response.body!
        }
      }));
    }
    else{
      this.GetGroceriesSorted(way, pressed, Id).subscribe()
      return null as any
    }
  }
  GetGroceriesSorted(way : string, pressed : string, Id : number){
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.get<GroceryList>('https://374a-89-234-249-144.ngrok-free.app/api/grocerylist/'+Id+'?SortBy='+pressed+'&SortDirection='+way, { observe: 'response', headers: headers })
    .pipe(tap(response => {
      if (response.ok) {
        this.Groceries[1].groceryEntries = response.body?.groceryEntries!
      }
    }));
  }
  CheckGroceries(Grocery : GroceryEntry, Amount : number){
    let NewGrocery = {
      amount: Grocery.amount,
      name: Grocery.name,
      price: Grocery.price,
      category: Grocery.category,
      unit: Grocery.unit
    }
    let entry = this.Groceries[1].groceryEntries.find(x => x.name == NewGrocery.name)
    if (entry != null && Amount == 1){
      entry.amount = entry.amount + 1
      this.AddAmount(this.Groceries[1].id!, entry.name, 1).subscribe()
    }
    else if (entry != null && Amount == -1){
      entry.amount = entry.amount - 1
      if(entry.amount <= 0){
        this.RemoveGroceryEntries(Grocery).subscribe()
        let newlist: GroceryEntry[] = []
        this.Groceries[1].groceryEntries.forEach(element => {
          if(element.name != Grocery.name){
            newlist.push(element)
          }
        });
        this.Groceries[1].groceryEntries = newlist
      }
      this.AddAmount(this.Groceries[1].id!, entry.name, -1).subscribe()
    }
    else if (entry == null){
      Grocery.amount = 1
      this.Groceries[1].groceryEntries.push(Grocery)
      this.AddGroceryEntries(NewGrocery).subscribe()
    }
  }
  AddGroceryEntries(Grocery : any){
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.post("https://374a-89-234-249-144.ngrok-free.app/api/grocerylist/"+ this.Groceries[1].id, Grocery, {headers: headers, responseType: 'text'})
  }
  RemoveGroceryEntries(Grocery : any){
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.delete("https://374a-89-234-249-144.ngrok-free.app/api/grocerylist/entry/"+ this.Groceries[1].id, {headers: headers, responseType: 'text', body: Grocery})
    .pipe(tap(response => {
      console.log(response);
    }))
  }
  AddGroceries(Id : number, Amount : number) : Observable<HttpResponse<GroceryEntry>>{
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.get<GroceryEntry>("https://374a-89-234-249-144.ngrok-free.app/api/grocery/"+ Id.toString(), {headers: headers, observe: 'response'})
    .pipe(tap(response => {
      if (response.ok) {
        this.CheckGroceries(response.body!, Amount)
      }
    }))
  }
  AddAmount(Id : number, GroceryName : string, Amount :  number){
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    let data = {
      GroceryName: GroceryName,
      AmountChange: Amount
    }
    return this.http.put("https://374a-89-234-249-144.ngrok-free.app/api/grocerylist/"+ Id, data, {headers: headers, responseType: 'text'})
  }
  AddList(){
    this.Main.nativeElement.classList.add("blur")
    this.Popup.nativeElement.classList.add("slideInto")
    if(this.Groceries[1] != undefined){
      this.Groceries[1] = {
        name: "__________",
        groceryEntries: []
      }
    }
    else{
      this.Groceries.push({
        name: "__________",
        groceryEntries: []
        }
      )
    }
  }
  AddGroceryList(){
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.post("https://374a-89-234-249-144.ngrok-free.app/api/grocerylist", this.Groceries[1], {headers: headers, responseType: 'text'})
    .pipe(tap(result => {
      this.Groceries[1].id = parseInt(result)
    }))
  }
  Clicked(){
    if(this.Input.nativeElement.value != ""){
      this.Groceries[1].name = this.Input.nativeElement.value
      this.Popup.nativeElement.classList.remove("slideInto")
      this.Popup.nativeElement.classList.add("slideBack")
      this.Main.nativeElement.classList.remove("blur")
      this.Main.nativeElement.classList.add("blurBack")
      this.AddGroceryList().subscribe()
      setTimeout(() => {
        this.Popup.nativeElement.classList.remove("slideBack")
        this.Main.nativeElement.classList.remove("blurBack")
      }, 2000);
      this.Input.nativeElement.value = ""
    }
    else{
      this.Button.nativeElement.classList.add("Wrong")
      setTimeout(() => {
        this.Button.nativeElement.classList.remove("Wrong")
      }, 650);
    }
  }
  GetLists(): Observable<HttpResponse<GroceryList[]>>{
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.get<GroceryList[]>("https://374a-89-234-249-144.ngrok-free.app/api/grocerylist/all/"+this.cookieService.get("Id"), {headers: headers, observe: 'response'})
    .pipe(tap(result =>{
      if(result.ok){
        this.lists = result.body!
        if (result.body! != null){
          this.ListsText.nativeElement.style.display = "block"
        }
      }
    }))
  }
  GetList(id : number): Observable<HttpResponse<GroceryList>>{
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.get<GroceryList>("https://374a-89-234-249-144.ngrok-free.app/api/grocerylist/"+id, {headers: headers, observe: 'response'})
    .pipe(tap(result =>{
      if(result.ok){
        let list = result.body!
        this.Groceries[1] = list
      }
    }))
  }
  Dropdown(){
    if (this.DontDrop == false) {
      if(this.Dropped){
        this.DropdownText.nativeElement.innerText = "List actions \\/ "
        this.Drop.nativeElement.classList.remove("Open")
        this.Drop.nativeElement.classList.add("Close")
        this.Dropped = false
        setTimeout(() => {
          this.AddButton.nativeElement.style.display = "none"
          this.ListsText.nativeElement.style.display = "none"
          this.lists = []
        }, 800);
      }
      else{
        this.DropdownText.nativeElement.innerText = 'List actions /\\ '
        this.GetLists().subscribe()
        this.Drop.nativeElement.classList.remove("Close")
        this.Drop.nativeElement.classList.add("Open")
        this.Dropped = true
        this.AddButton.nativeElement.style.display = "block"
      }
    }
  }
  ShowList(event : Event){
    let span = event.target as HTMLDivElement
    if(span.id != "Button"){
      if(span.id == ""){
        let child = span.firstChild as HTMLSpanElement
        this.GetList(parseInt(child.id)).subscribe()
      }
      else{
        this.GetList(parseInt(span.id)).subscribe()
      }
    }
  }
  DeleteList(event : Event){
    this.DontDrop = true
    let button = event.target as HTMLDivElement
    let list = button.parentElement?.lastChild as HTMLSpanElement
    setTimeout(() => {
      this.DontDrop = false
    }, 20);
    this.RemoveList(parseInt(list.id)).subscribe()
  }
  RemoveList(id : number){
    const headers= new HttpHeaders()
      .set('Authorization', this.cookieService.get("Token"))
      .set('ngrok-skip-browser-warning', 'true')
    return this.http.delete("https://374a-89-234-249-144.ngrok-free.app/api/grocerylist/"+ id, {headers: headers, responseType: 'text', observe: 'response'})
    .pipe(tap(response => {
      if(response.ok){
        let newlist: GroceryList[] = []
        this.lists.forEach(element => {
          if(element.id != id){
            newlist.push(element)
          }
        });
        this.lists = newlist
      }
    }))
  }
}
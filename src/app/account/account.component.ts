import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

let RegVisible : boolean = true
let Oldtext : string
let serverResponse : string = ""
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, AccountComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ){}
  FlipPage(flip : string){
    let Register = document.getElementById("Register")!
    let Login = document.getElementById("Login")!
    let Button = document.getElementById("ButtonText")!
    if(flip == 'R'){
      RegVisible = false
      Button.classList.add("ButtonAnim")
      Register.classList.remove("Higher")
      Register.classList.add("Old")
      Login.classList.add("New")
      setTimeout(() => {
        Button.innerText = "Login"
      }, 1500);
      setTimeout(() => {
        Login.classList.add("Higher")
        Register.classList.remove("Old")
        Login.classList.remove("New")
        Button.classList.remove("ButtonAnim")
      }, 3000);
    }
    if(flip == 'L'){
      RegVisible = true
      Button.classList.add("ButtonAnim")
      Login.classList.remove("Higher")
      Register.classList.add("New")
      Login.classList.add("Old")
      setTimeout(() => {
        Button.innerText = "Register"
      }, 1500);
      setTimeout(() => {
        Register.classList.add("Higher")
        Register.classList.remove("New")
        Login.classList.remove("Old")
        Button.innerText = "Register"
        Button.classList.remove("ButtonAnim")
      }, 3000);
    }
  }
  ButtonPress(){
    let Button = document.getElementById("Button")!
    let ButtonText = document.getElementById("ButtonText")!
    let ButtonLoading = document.getElementById("ButtonLoading")!
    if (RegVisible){
      let RUsername = document.getElementById("RUsername")! as HTMLInputElement
      let REmail = document.getElementById("REmail")! as HTMLInputElement
      let RBirth = document.getElementById("RBirth")! as HTMLInputElement
      let RPassword = document.getElementById("RPassword")! as HTMLInputElement
      let RCPassword = document.getElementById("RCPassword")! as HTMLInputElement
      if (RUsername.value != "" && REmail.value != "" && RBirth.value != "" && RPassword.value != "" && RCPassword.value != ""){
        let data = {
          email: REmail.value,
          password: RPassword.value,
          confirmPassword: RCPassword.value,
          dateOfBirth: RBirth.value,
          name: RUsername.value
        }
        this.CreateAccout(data).subscribe()
      }
      Button.classList.add("ButtonSubmitAnim")
      ButtonText.classList.add("DissapearText")
      setTimeout(() => {
        ButtonLoading.classList.add("ButtonLoadingAnim")
      }, 1000);
      setTimeout(() => {
        Oldtext = ButtonText.innerText
        if (RUsername.value == "" || REmail.value == "" || RBirth.value == "" || RPassword.value == "" || RCPassword.value == ""){
          Button.classList.add("ButtonError")
          ButtonText.innerText = "Fill every input"
        }
        else if(serverResponse == "Good"){
          ButtonText.innerText = "Account created"
          Button.classList.add("ButtonSucc")
        }
        else if(serverResponse == "Bad" || serverResponse == ""){
          ButtonText.innerText = "Something went wrong"
          Button.classList.add("ButtonError")
        }
        serverResponse = ""
        Button.classList.remove("ButtonSubmitAnim")
        setTimeout(() => {
          Button.classList.remove("ButtonSucc")
          Button.classList.remove("ButtonError")
          Button.classList.add("ButtonAnimRev")
          ButtonText.classList.remove("DissapearText")
          ButtonText.classList.add("ApearText")
          setTimeout(() => {
            ButtonLoading.classList.remove("ButtonLoadingAnim")
            Button.classList.remove("ButtonAnimRev")
            ButtonText.classList.remove("ApearText")
            setTimeout(() => {
              if(ButtonText.innerText == "Account created"){
                this.FlipPage("R")
              }
              ButtonText.innerText = Oldtext
            }, 1000);
          }, 2000);
        }, 2000);
      }, 4000);
    }
    else{
      let LEmail = document.getElementById("LEmail")! as HTMLInputElement
      let LPassword = document.getElementById("LPassword")! as HTMLInputElement
      if (LEmail.value != "" && LPassword.value != ""){
        let data = {
          email: LEmail.value,
          password: LPassword.value,
        }        
        this.Login(data).subscribe()
      }
      Button.classList.add("ButtonSubmitAnim")
      ButtonText.classList.add("DissapearText")
      setTimeout(() => {
        ButtonLoading.classList.add("ButtonLoadingAnim")
      }, 1000);
      setTimeout(() => {
        Oldtext = ButtonText.innerText
        if (LEmail.value == "" || LPassword.value == ""){
          Button.classList.add("ButtonError")
          ButtonText.innerText = "Fill every input"
        }
        else if(serverResponse == "Good"){
          Button.classList.add("ButtonSucc")
          setTimeout(() => {
            this.router.navigate(["lists"])
          }, 1000);
        }
        else if(serverResponse == "Bad" || serverResponse == ""){
          ButtonText.innerText = "Something went wrong"
          Button.classList.add("ButtonError")
        }
        serverResponse = ""
        Button.classList.remove("ButtonSubmitAnim")
        setTimeout(() => {
          Button.classList.remove("ButtonSucc")
          Button.classList.remove("ButtonError")
          Button.classList.add("ButtonAnimRev")
          ButtonText.classList.remove("DissapearText")
          ButtonText.classList.add("ApearText")
          setTimeout(() => {
            ButtonLoading.classList.remove("ButtonLoadingAnim")
            Button.classList.remove("ButtonAnimRev")
            ButtonText.classList.remove("ApearText")
            setTimeout(() => {
              ButtonText.innerText = Oldtext
            }, 1000);
          }, 2000);
        }, 2000);
      }, 4000);
    }
  }
  CreateAccout(data : any){
    const headers= new HttpHeaders({'ngrok-skip-browser-warning': 'true'});
    return this.http.post('https://374a-89-234-249-144.ngrok-free.app/api/account/register', data, { observe: 'response', headers: headers })
    .pipe(tap(response => {
      console.log(response.status);
      if (response.ok){
        serverResponse = "Good"
      }
      else{
        serverResponse = "Bad"
      }      
    }))
  }
  Login(data: any) {
    const headers= new HttpHeaders({'ngrok-skip-browser-warning': 'true'});
  return this.http.post('https://374a-89-234-249-144.ngrok-free.app/api/account/login', data, {responseType: 'text',  observe: 'response', headers: headers })
    .pipe(tap(response => {
      let token = "Bearer"+' '+ response.body?.split(".,.")[0]
      let Id = response.body?.split(".,.")[1]
      if (response.ok) {
        serverResponse = "Good";
        this.cookieService.set("Token", token)
        this.cookieService.set("Id", Id!)
      } else {
        serverResponse = "Bad";
      }
    }));
}
}

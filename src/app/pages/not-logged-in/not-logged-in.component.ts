import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-logged-in',
  templateUrl: './not-logged-in.component.html',
  styleUrls: ['./not-logged-in.component.scss']
})
export class NotLoggedInComponent {

  constructor(private router: Router){

  }

  navigateLogin(){
    this.router.navigate(['account/login'])
  }

  navigateRegister(){
    this.router.navigate(['account/register'])
  }
}

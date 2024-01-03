import { AccountService } from './../../services/account/account.service';
import { Account } from 'src/app/model/account.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  isLogged = false

  constructor(private account: AccountService){}

  ngOnInit(): void {
    if(this.account.account != undefined){
      this.isLogged = true
    }
  }

  getAccount(){
    return this.account.account
  }

  signOut(){
    this.isLogged = false
    this.account.signOut()
  }

  getIsLogged(){
    return this.account.account != undefined
  }
}

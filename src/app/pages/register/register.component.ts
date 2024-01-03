import { AccountService } from './../../services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'src/app/model/account.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../account/account.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  allErrorVisibleForm: boolean = false;

  constructor(private fb: FormBuilder, private as: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  getInteractionForm(formGrop: FormGroup, controlName: string) {
    let control = formGrop.get(controlName);
    return control?.touched || control?.dirty || this.allErrorVisibleForm;
  }

  signUp() {
    console.log(this.form);
      this.register()
  }

  register() {
    if (this.form.valid) {
      let account: Account = {
        id: '',
        photo: '',
        photoUrl: '',
        name: this.form.get('nome')?.value,
        email: this.form.get('email')?.value,
        password: this.form.get('senha')?.value,
        phone: '',
        tokenAccess: '',
        typeAccount: 'CLIENTE'
      };

      console.log(account)

      this.as.save(account).subscribe({
        next: (data) => {
          this.as.signInSetAccount(data.email, this.form.get('senha')?.value).subscribe(data => {
            this.router.navigate(['/m/home'])
          })
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../account/account.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  allErrorVisibleForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private as: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      senha: [null, [Validators.required]],
    });
  }

  getInteractionForm(formGrop: FormGroup, controlName: string) {
    let control = formGrop.get(controlName);
    return control?.touched || control?.dirty || this.allErrorVisibleForm;
  }

  login() {
    if (this.form.valid) {
      this.as
        .signInSetAccount(
          this.form.get('email')?.value,
          this.form.get('senha')?.value
        )
        .subscribe({
          next: (data) => {
            this.router.navigate(['/m/home']);
          },
          error: (err: HttpErrorResponse) => {
            if(err.status === 404){
              this.form.get("email")?.setErrors({"EmailNotFound" : true})
            }

            if(err.status === 403){
              this.form.get("senha")?.setErrors({"passwordNoUnauthored" : true})
            }
          },
        });
    }
  }
}

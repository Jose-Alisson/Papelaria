import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { ItemComponent } from './pages/item/item.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashComponent } from './pages/dash/dash.component';
import { AccountComponent } from './pages/account/account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotLoggedInComponent } from './pages/not-logged-in/not-logged-in.component';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterProductComponent } from './pages/register-product/register-product.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { ProductManagerComponent } from './pages/product-manager/product-manager.component';
import { AdmPageComponent } from './pages/adm-page/adm-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'm', pathMatch: 'full' },
  {
    path: 'm',
    component: DashComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'buscar', component: BuscarComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'cart', component: CartComponent },
      { path: 'item/:id', component: ItemComponent },
      {
        path: 'adm',
        children: [
          { path: '', redirectTo: 'page', pathMatch: 'full' },
          { path: 'page', component : AdmPageComponent,},
          { path: 'product-manager', component: ProductManagerComponent }
        ],
      },
    ],
  },
  {
    path: 'account',
    component: AccountComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    ItemComponent,
    LoginComponent,
    RegisterComponent,
    DashComponent,
    AccountComponent,
    ProfileComponent,
    NotLoggedInComponent,
    BuscarComponent,
    CheckoutComponent,
    RegisterProductComponent,
    ProductManagerComponent,
    AdmPageComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpClientModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule
  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}

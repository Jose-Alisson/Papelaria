import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { ItemComponent } from './pages/item/item.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'cart', component: CartComponent },
  { path: 'item/:id', component: ItemComponent },
];

@NgModule({
  declarations: [AppComponent, HomeComponent, CartComponent, ItemComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes, { useHash: true })],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { Address } from 'src/app/model/address.model';
import { AccountService } from 'src/app/services/account/account.service';
import { AddressService } from 'src/app/services/address/address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: [
    '../../../pages/cart/cart.component.scss',
    './address.component.scss',
  ],
})
export class AddressComponent {

  @ViewChild('viewAddress')
  viewAddress!: TemplateRef<any>

  addrS = inject(AddressService);
  private as = inject(AccountService);
  private form = inject(FormBuilder);

  @Output()
  addressEmitter: EventEmitter<Address> = new EventEmitter()

  @Input()
  address: Address | null = null

  formAddress = this.form.group({
    addressName: ['', []],
    houseNumber: ['', []],
    cep: ['', []],
    pointReference: ['', []],
    complement: ['', []]
  })

  cepControl = this.form.control('cep', [Validators.required, Validators.minLength(8)]);
  result: any;

  /*
  0 : vizualizar cep
  1 : visulizar endereço
  */
  @Input()
  typeVisualComp = 0

  //Open Modal Select Address
  openMsa = false
  openMca = false
  isActiveSearchCep = true

  findAddress() {
    if (this.cepControl.valid) {
      this.addrS.findAddress(this.cepControl.value ?? '').pipe(tap(() => {
        this.isActiveSearchCep = false
      })).subscribe((data) => {
        this.isActiveSearchCep = true
        this.result = data;
      });
    }
  }

  isDelevery() {
    if(this.result?.distance){
      return this.result.distance <= this.addrS.taxas[this.addrS.taxas.length - 1].max
    }
    return false
  }

  openModalAddress(){
    this.openMsa = true

    this.addrS.findAllByUserId(this.as.account?.id ?? '').subscribe(data => {
      this.addrS.addresses = data
    })
  }

  select(address: Address){
    this.address = address
    this.addressEmitter.emit(address)
    this.openMsa = false

    this.typeVisualComp = 2
  }

  getAutoLocation(){
    if (navigator.geolocation) {
      // O navegador suporta a API de geolocalização
      navigator.geolocation.getCurrentPosition(function(position) {
        // Callback de sucesso
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        alert("Latitude: " + latitude + ", Longitude: " + longitude);

        // Aqui, você pode fazer o que quiser com as coordenadas, como enviar para um servidor, exibir no mapa, etc.
      }, function(error) {
        // Callback de erro
        alert("Erro ao obter a localização: " + error.message);
      });
    } else {
      // O navegador não suporta a API de geolocalização
      alert("Geolocalização não suportada pelo navegador");
    }
  }
}

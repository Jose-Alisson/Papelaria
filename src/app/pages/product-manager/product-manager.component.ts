import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/model/product.model';
import { ImageService } from 'src/app/services/imgService/img-service.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss', '../cart/cart.component.scss']
})
export class ProductManagerComponent implements OnInit{

  typeAction = ""

  file!: File

  cadastredProduct: Product[] = []

  productForm!: FormGroup

  constructor(private act: ActivatedRoute, private ps: ProductService, private imgS: ImageService, private form: FormBuilder, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.productForm = this.form.group({
      id: [null],
      productName: [null, []],
      photoUrl: [],
      description: [null, []],
      allDescription: [null, []],
      basePrice: [null, []],
      category: [null, []],
      available: [null, []],
      productAttributes: []
    })

    this.ps.getAll().subscribe(data => {
      this.cadastredProduct = data

      data.forEach(product => {
        this.imgS.downloadImagem(product.photoUrl).subscribe(img => {
          product.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(img))
        })
      })
    })
  }

  saveProduct() {
    if(this.file){
      this.imgS.uploadImage(this.file).subscribe(data => {

        let product = this.getFormProduct()
        product.photoUrl = data

        this.ps.save(product).subscribe(dp => {
          this.addToCadastricList(dp)
          this.clearProductForm()
        })
      })
    }
    else {
      this.ps.save(this.getFormProduct()).subscribe(dp => {
        this.addToCadastricList(dp)
        this.clearProductForm();
      })
    }
  }

  setFormProductValue(product: Product){
    this.productForm.setValue(product)
  }

  private getFormProduct(){
    let product: Product = {
      id: this.productForm.get('id')?.value,
      photoObject: {},
      photoUrl: '',
      productName: this.productForm.get('productName')?.value,
      description: this.productForm.get('description')?.value,
      allDescription: this.productForm.get('allDescription')?.value,
      basePrice: this.productForm.get('basePrice')?.value,
      category: this.productForm.get('category')?.value,
      available: this.productForm.get('available')?.value,
      productAttributes: []
    }

    return product
  }

  clearProductForm(){
    this.productForm.setValue({})
  }

  addToCadastricList(product: Product){
    let index = this.cadastredProduct.findIndex(p => product.id === p.id)

    if(index === -1){
      this.cadastredProduct.push(product);
    }
  }
}

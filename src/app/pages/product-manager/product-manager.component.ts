import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/model/product.model';
import { ImageService } from 'src/app/services/imgService/img-service.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.scss', '../cart/cart.component.scss']
})
export class ProductManagerComponent implements OnInit {

  typeAction = 0

  file!: File
  fileView: SafeUrl | undefined 

  cadastredProduct: Product[] = []

  productForm!: FormGroup

  isOpenModalDelete = false
  isOpenModalCreate = false

  constructor(private act: ActivatedRoute, private ps: ProductService, private imgS: ImageService, private form: FormBuilder, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.productForm = this.form.group({
      id: ['', []],
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
    if (this.file) {
      this.imgS.uploadImage(this.file).subscribe((data: { photoUrl: string; }) => {

        let product = this.getFormProduct()
        product.photoUrl = data.photoUrl

        this.ps.save(product).subscribe(dp => {
          this.addToCadastricList(dp)
          this.isOpenModalCreate = false
          this.clearProductForm()
        })
      })
    }
    else {
      this.ps.save(this.getFormProduct()).subscribe(dp => {
        this.addToCadastricList(dp)
        this.isOpenModalCreate = false
        this.clearProductForm();
      })
    }
  }

  openModalCreate() {
    this.clearProductForm()
    this.isOpenModalCreate = true
  }

  openModalDelete() {
    this.isOpenModalDelete = true
  }

  deleteProduct() {
    this.ps.delete(this.productForm.get('id')?.value).subscribe(data => {
      this.cadastredProduct = this.cadastredProduct.filter(p => p.id != this.productForm.get('id')?.value)
      this.clearProductForm()
      this.isOpenModalDelete = false
    })
  }

  setFormProductValue(product: Product) {
    this.fileView = product.photoObject
    this.productForm.setValue(product)
  }

  private getFormProduct() {
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

  clearProductForm() {
    this.productForm.setValue({
      id: '',
      productName: '',
      photoUrl: '',
      description: '',
      allDescription: '',
      basePrice: '',
      category: '',
      available: '',
      productAttributes: []
    })
  }

  addToCadastricList(product: Product) {
    let index = this.cadastredProduct.findIndex(p => product.id === p.id)

    if (index === -1) {
      this.cadastredProduct.push(product);
    }
  }

  openModalActionRelative(product: Product) {
    switch (this.typeAction) {
      case 0:
        this.openModalCreate()
        break;
      case 1:
        this.openModalCreate()
        this.setFormProductValue(product)
        break;
      case 2:
        this.openModalDelete()
        this.setFormProductValue(product)
        break;
      default:
        break;
    }
  }

  isModeDelete(){
    return this.typeAction === 2
  }

  onDragOver(event: DragEvent){
    event.preventDefault()
    event.stopPropagation()
  }

  onDrop(event: DragEvent){
    event.preventDefault()
    event.stopPropagation();

    const file = event.dataTransfer?.files

    if(file && file.length > 0){
      this.file = file[0]
      this.fileView = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
    }
  }

  onFileSelected(event: any){
    const fileList: FileList | null = event.target.files

    if(fileList && fileList.length  > 0){
      this.file = fileList[0]
      this.fileView = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
    }
  }
}

import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProductAttribute } from 'src/app/model/ProductAttribute.model';
import { Product } from 'src/app/model/product.model';
import { ImageService } from 'src/app/services/imgService/img-service.service';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['../item/item.component.scss','./product-manager.component.scss', '../buscar/buscar.component.scss', '../adm-page/adm-page.component.scss']
})
export class ProductManagerComponent implements OnInit {

  typeAction = 0

  file!: File

  productImagePreview: SafeUrl = {}

  productImages: SafeUrl[] = []

  cadastredProduct: Product[] = []

  product: Product = {
    id: '',
    photoObject: {},
    photoUrl: '',
    productName: '',
    description: '',
    allDescription: '',
    basePrice: 0,
    category: '',
    available: 0,
    productAttributes: []
  }

  productForm!: FormGroup

  isOpenModalDelete = false
  isOpenModalCreate = false
  isOpenModalEdit = false

  allAtributeSelection: {
    categoryName : string,
    attributes: ProductAttribute []
    attributesSelected: ProductAttribute | undefined
  }[] = []

  @ViewChild('fomProduct')
  fomProduct!: TemplateRef<any>

  constructor(private act: ActivatedRoute, private ps: ProductService, private imgS: ImageService, private form: FormBuilder, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.productForm = this.form.group({
      id: ['', []],
      productName: [null, []],
      photoUrl: [null, []],
      photoObject: [],
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

  openModalEdit(product: Product){
    console.log(product)
    this.product = product
    this.clearProductForm()
    this.setFormProductValue(product)
    this.isOpenModalEdit = true

    product.productAttributes.forEach(attribute => {
      if(attribute.photoUrl != undefined || attribute.photoUrl != null || attribute.photoUrl == ""){
        this.imgS.downloadImagem(attribute.photoUrl).subscribe({
          next: (imageBlob) => {

            let img = this.sanitizer.bypassSecurityTrustUrl(
              URL.createObjectURL(imageBlob)
            )
            attribute.photoObject = img
            this.productImages.push(img);
          },
        });
      }
    })

    this.getAllCategoryAttribute(product).forEach(category => {
      console.log(category)

      let numberSelection = 0

      this.getAllAttributeFromCategory(product,category).forEach(attribute => {
        console.log(attribute)
        if(attribute.numberSelection > numberSelection){
          numberSelection = attribute.numberSelection
        }
      })

      let counter = 0

      do {
        counter++;
        this.allAtributeSelection.push({
          categoryName: `${counter > 1 ? (counter + " " + category) : category}`,
          attributes: this.getAllAttributeFromCategory(product, category),
          attributesSelected: undefined
        })
      } while (counter < numberSelection)

    })
  }

  deleteProduct() {
    this.ps.delete(this.productForm.get('id')?.value).subscribe(data => {
      this.cadastredProduct = this.cadastredProduct.filter(p => p.id != this.productForm.get('id')?.value)
      this.clearProductForm()
      this.isOpenModalDelete = false
    })
  }

  setFormProductValue(product: Product) {
    this.productImagePreview = product.photoObject
    this.productForm.setValue(product)
  }

  private getFormProduct() {
    let product: Product = {
      id: this.productForm.get('id')?.value,
      photoObject: {},
      photoUrl: this.productForm.get('photoUrl')?.value,
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
      photoObject: '',
      description: '',
      allDescription: '',
      basePrice: '',
      category: '',
      available: '',
      productAttributes: []
    })
    this.productImagePreview = {}

    this.product = {
      id: '',
      photoObject: {},
      photoUrl: '',
      productName: '',
      description: '',
      allDescription: '',
      basePrice: 0,
      category: '',
      available: 0,
      productAttributes: []
    }

    this.allAtributeSelection = []

    this.productImages = []
  }

  addToCadastricList(product: Product) {
    let index = this.cadastredProduct.findIndex(p => product.id === p.id)

    if (index === -1) {
      this.cadastredProduct.push(product);
    }
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
      this.productImagePreview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
    }
  }

  onFileSelected(event: any){
    const fileList: FileList | null = event.target.files

    if(fileList && fileList.length  > 0){
      this.file = fileList[0]
      this.productImagePreview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
    }
  }

  setPreviewImage(img: SafeUrl){
    this.productImagePreview = img
  }

  formEdit(controlName: string){
    return this.productForm.get(controlName)?.value
  }

  getAllCategoryAttribute(product: Product) {
    const categoriaUnicasSet = new Set<string>();
    product.productAttributes.forEach((data) => categoriaUnicasSet.add(data.attributeCategory));
    const datasUnicas: string[] = Array.from(categoriaUnicasSet);
    return datasUnicas;
  }

  getAllAttributeFromCategory(product: Product, category: string) {
    return product.productAttributes.filter((attribute) => attribute.attributeCategory === category);
  }

  setImagePreviw(attr: ProductAttribute){
    if(attr.photoObject != undefined && attr.photoObject != null && attr.photoObject){
      this.productImagePreview = attr.photoObject
    } else {
      this.productImagePreview = this.product.photoObject
    }
  }
}

import { filter } from 'rxjs';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ProductAttribute } from 'src/app/model/ProductAttribute.model';
import { Product } from 'src/app/model/product.model';
import { ImageService } from 'src/app/services/imgService/img-service.service';
import { ProductService } from 'src/app/services/product/product.service';
import { PAttributeService } from 'src/app/services/productAttibute/p-attribute.service';
import { AttributeManagerComponent } from 'src/app/shared/comp/attribute-manager/attribute-manager.component';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: [
    '../item/item.component.scss',
    './product-manager.component.scss',
    '../buscar/buscar.component.scss',
    '../adm-page/adm-page.component.scss',
  ],
})
export class ProductManagerComponent implements OnInit {

  file!: File;

  productImagePreview: SafeUrl | undefined;

  productImages: SafeUrl[] = [];
  cadastredProduct: Product[] = [];

  product:Product = {
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

  @ViewChild('fomProduct')
  fomProduct!: TemplateRef<any>;

  @ViewChild('attrManager')
  attrManager!: AttributeManagerComponent

  isOpenModalEdit = false
  isOpenModalCreate = false
  isOpenModalDelete = false

  private attrS = inject(PAttributeService);
  private form = inject(FormBuilder);

  productForm = this.form.group({
      id: ['', []],
      productName: ['', []],
      photoUrl: ['', []],
      description: ['', []],
      allDescription: ['', []],
      basePrice: [0, []],
      category: ['', []],
      available: [0, []],
      productAttributes: [Array.from(new Set<ProductAttribute>()), []],
    });;


  constructor(
    private act: ActivatedRoute,
    private ps: ProductService,
    private imgS: ImageService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.ps.getAll().subscribe((data) => {
      this.cadastredProduct = data;

      data.forEach((product) => {
        this.imgS.downloadImagem(product.photoUrl).subscribe((img) => {
          product.photoObject = this.sanitizer.bypassSecurityTrustUrl(
            URL.createObjectURL(img)
          );
        });
      });
    });
  }

  saveProduct() {
    if (this.file) {
      this.imgS.uploadImage(this.file).subscribe((data) => {
        let product = this.getFormProduct();
        product.photoUrl = data.photoUrl;
        this.ps.save(product).subscribe((dp) => {
          this.addToCadastricList(dp);
          this.isOpenModalCreate = false;
          this.clearProductForm()
          this.imgS.downloadImagem(dp.photoUrl).subscribe(data => {
            dp.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
          })

          let index = this.cadastredProduct.findIndex(p => p.id === dp.id)

          if(index != -1 ){
            this.cadastredProduct[index] = dp
          } else {
            this.cadastredProduct.push(dp)
          }
        });
      });
    } else {
      this.ps.save(this.getFormProduct()).subscribe((dp) => {
        this.addToCadastricList(dp);
        this.isOpenModalCreate = false;
        this.clearProductForm();
        this.imgS.downloadImagem(dp.photoUrl).subscribe(data => {
          dp.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
        })

        let index = this.cadastredProduct.findIndex(p => p.id === dp.id)

          if(index != -1 ){
            this.cadastredProduct[index] = dp
          } else {
            this.cadastredProduct.push(dp)
          }
      });
    }
  }

  updateProduct() {
    this.saveProduct();
    this.isOpenModalEdit = false;
  }

  openModalCreate() {
    this.clearProductForm();

    if(this.attrManager){
      console.log('Entrando')
      this.attrManager.clearProductSelections()
    }

    this.isOpenModalCreate = true;
  }

  openModalDelete() {
    this.isOpenModalDelete = true;
  }

  openModalEdit(product: Product) {
    this.clearProductForm();
    this.product = product
    this.setFormProductValue(product);
    this.productImages.push(product.photoObject);

    if(this.attrManager){
      this.attrManager.autoFind(product)
    }

    this.isOpenModalEdit = true;
  }

  deleteProduct() {
    this.ps.delete(this.productForm.controls.id.value ?? '').subscribe((data) => {
      this.cadastredProduct = this.cadastredProduct.filter(
        (p) => p.id != this.productForm.get('id')?.value
      );
      this.clearProductForm();
      this.isOpenModalDelete = false;
    });
  }

  setFormProductValue(product: Product) {
    this.productImagePreview = product.photoObject;

    this.productForm.setValue({
      id: product.id,
      productName: product.productName,
      photoUrl: product.photoUrl,
      description: product.description,
      allDescription: product.allDescription,
      basePrice: product.basePrice,
      category: product.category,
      available: product.available,
      productAttributes: product.productAttributes
    });
  }

  private getFormProduct() {

    let product: Product = {
      id: this.productForm.controls.id.value ?? '',
      photoObject: {},
      photoUrl: this.productForm.controls.photoUrl.value ?? '',
      productName: this.productForm.controls.productName.value ?? '',
      description: this.productForm.controls.description.value ?? '',
      allDescription: this.productForm.controls.allDescription.value ?? '',
      basePrice: this.productForm.controls.basePrice.value ?? 0,
      category: this.productForm.controls.category.value ?? '',
      available: this.productForm.controls.available.value ?? 0,
      productAttributes: this.productForm.controls.productAttributes.value ?? []
    }

    return product;
  }

  clearProductForm() {
    this.productForm.reset()

    this.productImagePreview = undefined;
    this.productImages = [];

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
  }

  addToCadastricList(product: Product) {
    let index = this.cadastredProduct.findIndex((p) => product.id === p.id);

    if (index === -1) {
      this.cadastredProduct.push(product);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer?.files;

    if (file && file.length > 0) {
      this.file = file[0];
      this.productImagePreview = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.file)
      );
    }
  }

  onFileSelected(event: any) {
    const fileList: FileList | null = event.target.files;

    if (fileList && fileList.length > 0) {
      this.file = fileList[0];
      this.productImagePreview = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.file)
      );
    }
  }

  setPreviewImage(img: SafeUrl) {
    this.productImagePreview = img;
  }

  formEdit(controlName: string) {
    return this.productForm.get(controlName)?.value;
  }

  getAllCategoryAttribute(product: Product) {
    const categoriaUnicasSet = new Set<string>();
    product.productAttributes.forEach((data) =>
      categoriaUnicasSet.add(data.attributeCategory)
    );
    const datasUnicas: string[] = Array.from(categoriaUnicasSet);
    return datasUnicas;
  }

  getAllAttributeFromCategory(product: Product, category: string) {
    return product.productAttributes?.filter(
      (attribute) => attribute.attributeCategory === category
    );
  }

  splitCategoryAttribute() {
    const cetegorySet = new Set<string>();
    this.productForm.get('productAttributes')?.value?.forEach((data: any) => {
      cetegorySet.add(data.attributeCategory);
    });
    return Array.from(cetegorySet);
  }

  getAttributesFromCategory(pa: ProductAttribute[], category: string) {
    return pa.filter((attribute) => attribute.attributeCategory === category);
  }

  exibirFormulario() {
    console.log(this.productForm.value);
  }

  setAtributosForm(attrs: ProductAttribute[]){
    this.productForm.controls.productAttributes.setValue(attrs)
  }

  setImages(imgs: SafeUrl[]){
    this.productImages = []
    this.productImages.push(this.productImagePreview ?? {})
    this.productImages.push(...imgs)
  }
}

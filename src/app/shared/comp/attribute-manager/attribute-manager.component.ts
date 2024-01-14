import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProductAttribute } from 'src/app/model/ProductAttribute.model';
import { Product } from 'src/app/model/product.model';
import { ImageService } from 'src/app/services/imgService/img-service.service';
import { Observable, catchError, of, tap } from 'rxjs';
import { PAttributeService } from 'src/app/services/productAttibute/p-attribute.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-attribute-manager',
  templateUrl: './attribute-manager.component.html',
  styleUrls: [
    './attribute-manager.component.scss',
    '../../../pages/item/item.component.scss',
    '../../../pages/buscar/buscar.component.scss',
    '../../../pages/product-manager/product-manager.component.scss',
  ],
})
export class AttributeManagerComponent implements OnInit {
  file?: File;

  @ViewChild('formAttribute')
  formAttribute!: TemplateRef<any>;

  attributeImagePreview: SafeUrl | undefined;

  allAtributeSelection: {
    categoryName: string;
    attributes: ProductAttribute[];
    attributesSelected: ProductAttribute | undefined;
  }[] = [];

  @Input()
  product?: Product;

  @Input()
  isCreate: boolean = false;

  @Input()
  isEditable: boolean = false;

  @Input()
  isSelection: boolean = false;

  isopenModalCreate = false;
  isopenModalEdit = false;
  isopenModalDelete = false;

  allAttributes: ProductAttribute[] = [];

  isLoading = true;

  attr?: ProductAttribute;

  @Output()
  attrImgEmmiter: EventEmitter<SafeUrl[]> = new EventEmitter();

  @Output()
  attrrsEmiter: EventEmitter<ProductAttribute[]> = new EventEmitter();

  @Output()
  attrSelect: EventEmitter<ProductAttribute> = new EventEmitter();

  @Output()
  attrSelectImgEmitter: EventEmitter<SafeUrl> = new EventEmitter()

  private form = inject(FormBuilder);
  private imgS = inject(ImageService);
  private sanitizer = inject(DomSanitizer);
  private attrService = inject(PAttributeService);

  attributeForm = this.form.group({
    id: ['', []],
    photoUrl: ['', []],
    attributeName: ['', []],
    attributeDescription: ['', []],
    attributePrice: [0, []],
    attributeCategory: ['', []],
    numberSelection: [1, []],
    available: [0, []],
  });

  constructor() {}

  ngOnInit(): void {
    this.find();
  }

  find() {
    if (this.product) {
      this.attrService
        .findByProductId(this.product.id)
        .pipe(
          tap(() => {
            this.isLoading = true;
          })
        )
        .subscribe({
          next: (data) => {
            this.isLoading = false;
            this.allAttributes = data;
            let images: SafeUrl[] = [];

            data.forEach((attr) => {
              this.imgS.downloadImagem(attr.photoUrl).subscribe({
                next: (imageBlob) => {

                  let img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imageBlob));
                  attr.photoObject = img;
                  images.push(img);
                  console.log(images)
                  this.attrImgEmmiter.emit(images);
                },
              });
            });

            this.setAttributeSelections(data);
          },
          error: (err: HttpErrorResponse) => {
            this.isLoading = false;
            this.allAtributeSelection = [];
          },
        });
    }
  }

  autoFind(product: Product) {
    this.product = product;
    this.find();
  }

  getAllAttributeFromCategory(attrs: ProductAttribute[], category: string) {
    return attrs.filter(
      (attribute) => attribute.attributeCategory === category
    );
  }

  getAllCategoryAttribute(attrs: ProductAttribute[]) {
    const categoriaUnicasSet = new Set<string>();
    attrs.forEach((data) => categoriaUnicasSet.add(data.attributeCategory));
    const datasUnicas: string[] = Array.from(categoriaUnicasSet);
    return datasUnicas;
  }

  openModalAttributeEdit(attr: ProductAttribute) {
    if (this.isEditable) {
      this.clearForm();

      this.attributeForm.setValue({
        id: attr.id,
        photoUrl: attr.photoUrl,
        attributeName: attr.attributeName,
        attributeDescription: attr.attributeDescription,
        attributePrice: attr.attributePrice,
        attributeCategory: attr.attributeCategory,
        numberSelection: attr.numberSelection,
        available: attr.available,
      });

      console.log(attr)


      this.attributeImagePreview = attr.photoObject;

      this.imgS.downloadImagem(attr.photoUrl).subscribe({next: (data) => {
        this.attributeImagePreview = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
      }})


      this.isopenModalEdit = true;
    }
  }

  getAttributeForm() {
    let attr: ProductAttribute = {
      id: this.attributeForm.controls.id.value ?? '',
      photoUrl: this.attributeForm.controls.photoUrl.value ?? '',
      photoObject: {},
      attributeName: this.attributeForm.controls.attributeName.value ?? '',
      attributeDescription:
        this.attributeForm.controls.attributeDescription.value ?? '',
      attributePrice: this.attributeForm.controls.attributePrice.value ?? 0,
      attributeCategory:
        this.attributeForm.controls.attributeCategory.value ?? '',
      numberSelection: this.attributeForm.controls.numberSelection.value ?? 0,
      available: this.attributeForm.controls.available.value ?? 0,
    };

    return attr;
  }

  clearForm() {
    this.attributeForm.reset();
  }

  clearProductSelections() {
    this.allAtributeSelection = [];
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
      this.attributeImagePreview = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.file)
      );
    }
  }

  onFileSelected(event: any) {
    const fileList: FileList | null = event.target.files;

    if (fileList && fileList.length > 0) {
      this.file = fileList[0];
      this.attributeImagePreview = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(this.file)
      );
      this.attributeForm.controls.photoUrl.setValue(
        `${fileList[0].name}.${fileList[0].type}`
      );
    }
  }


  openModalCreate() {
    this.clearForm();
    this.isopenModalCreate = true;
  }

  save() {
    if (this.file) {
      this.imgS.uploadImage(this.file).subscribe((imgUrl) => {
        console.log(imgUrl)

        this.attributeForm.controls.photoUrl.setValue(imgUrl.photoUrl)

        this.attrService.save(this.getAttributeForm()).subscribe((data) => {
          console.log(data)

          let index = this.allAttributes.findIndex((attr) => attr.id === data.id);

          if (index != -1) {
            this.allAttributes[index] = data;
          } else {
            this.allAttributes.push(data);
          }

          this.setAttributeSelections(this.allAttributes);
          this.attrrsEmiter.emit(this.allAttributes);

        });
      });
    } else {
      this.attrService.save(this.getAttributeForm()).subscribe((data) => {
        let index = this.allAttributes.findIndex((attr) => attr.id === data.id);

        if (index != -1) {
          this.allAttributes[index] = data;
        } else {
          this.allAttributes.push(data);
        }
        this.setAttributeSelections(this.allAttributes);
        this.attrrsEmiter.emit(this.allAttributes);
      });
    }
  }

  delete() {
    let id = this.attributeForm.controls.id.value;

    if (id && id !== '') {
      this.attrService.delete(id).subscribe(() => {
        this.allAttributes = this.allAttributes.filter(
          (attr) => attr.id === id
        );
        this.attrrsEmiter.emit(this.allAttributes);
      });
    } else {
      if (this.attr) {
        this.allAttributes = this.allAttributes.filter(
          (attr) => attr.id === this.attr?.id
        );
        this.attrrsEmiter.emit(this.allAttributes);
      }
    }

    this.setAttributeSelections(this.allAttributes);
  }

  setAttributeSelections(attrs: ProductAttribute[]) {
    this.allAtributeSelection = [];

    this.getAllCategoryAttribute(attrs).forEach((category) => {
      let numberSelection = 0;

      this.getAllAttributeFromCategory(attrs, category).forEach((attribute) => {
        if (attribute.numberSelection > numberSelection) {
          numberSelection = attribute.numberSelection;
        }
      });

      let counter = 0;

      do {
        counter++;
        this.allAtributeSelection.push({
          categoryName: `${counter > 1 ? counter + ' ' + category : category}`,
          attributes: this.getAllAttributeFromCategory(attrs, category),
          attributesSelected: undefined,
        });
      } while (counter < (numberSelection <= 0 ? 1 : numberSelection));
    });
  }

  selectAttr(
    category: {
      categoryName: string;
      attributes: ProductAttribute[];
      attributesSelected: ProductAttribute | undefined;
    },
    attr: ProductAttribute
  ) {
    if (this.isSelection) {
      if (category.attributesSelected === attr) {
        category.attributesSelected = undefined;
        return;
      }
      category.attributesSelected = attr;

      if(category.attributesSelected.photoObject){
        this.attrSelectImgEmitter.emit(category.attributesSelected.photoObject)
      }
    }
  }

  getAllAttributeSelection() {
    let attrs: ProductAttribute[] = [];

    this.allAtributeSelection.forEach((attrsS) => {
      if (attrsS.attributesSelected) {
        attrs.push(attrsS.attributesSelected);
      }
    });

    return attrs;
  }
}

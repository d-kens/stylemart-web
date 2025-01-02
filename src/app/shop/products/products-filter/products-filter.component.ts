import { Component, effect, input, output } from '@angular/core';
import { ProductFilter, ProductFilterForm, sizes } from '../../../admin/data-access/models/product.model';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-filter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.scss'
})
export class ProductsFilterComponent {

  size = input<string>();

  protected readonly sizes = sizes;

  productFilter = output<ProductFilter>();


  constructor() {
    effect(() => this.updateSizeFormValue())
    this.productFilterForm.valueChanges.subscribe(() => this.onFilterChange(this.productFilterForm.getRawValue()))
  }
 
  productFilterForm: FormGroup = new FormGroup({
    size: this.buildSizeFormControl()
  });

  
  private buildSizeFormControl(): FormRecord<FormControl<boolean>> {
    const sizeFormControl = new FormRecord<FormControl<boolean>>({});
    
    for (const size of sizes) {
      sizeFormControl.addControl(
        size,
        new FormControl<boolean>(false, { nonNullable: true })
      );
    }

    return sizeFormControl;
  }


  private onFilterChange(filter: Partial<ProductFilterForm>): void {

    const filterProduct: ProductFilter = {
      size: ''
    };

    let sizes: [string, boolean][] = [];

    if(filter.size !== undefined) {
      sizes = Object.entries(filter.size);
    }
    
    for(const [sizeKey, sizeValue] of sizes) {
      if(sizeValue) {
        if(filterProduct.size?.length === 0) {
          filterProduct.size = sizeKey;
        } else {
          filterProduct.size += `,${sizeKey}`;
        }
      }
    }

    this.productFilter.emit(filterProduct);
  }


  public getSizeFormGroup(): FormRecord<FormControl<boolean>> {
    return this.productFilterForm.get('size') as FormRecord<
      FormControl<boolean>
    >;
  }

  private updateSizeFormValue() {
    if (this.size()) {
      const sizes = this.size()!.split(',');
      for (const size of sizes) {
        this.getSizeFormGroup().get(size)!.setValue(true, { emitEvent: false });
      }
    }
  }
  

}

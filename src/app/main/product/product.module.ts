import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrandComponent } from './brand/brand.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [ 
    OrderComponent,ProductComponent,TypeComponent, BrandComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'type',
        component: TypeComponent,
      },
      { path: 'brand', 
      component: BrandComponent 
    }
  ]),  
  ]
})
export class ProductModule { }

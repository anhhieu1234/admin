import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit {
  public sanphams: any;
  public sanpham: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  allloai:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'ten': [''],
      'gia': [''],     
    });
   
   this.search();
   this._api.get('/api/LoaiSanPham/get-menu').takeUntil(this.unsubscribe).subscribe(res => {
    this.allloai = res;
    });
  }

  loadPage(page) { 
    this._api.post('/api/sanpham/searchadmin',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sanphams = res.data;
      
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/sanpham/searchadmin',{page: this.page, pageSize: this.pageSize, ten: this.formsearch.get('ten').value, gia: this.formsearch.get('gia').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sanphams = res.data;
      console.log(this.sanphams);
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  // pwdCheckValidator(control){
  //   var filteredStrings = {search:control.value, select:'@#!$%&*'}
  //   var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
  //   if(control.value.length < 6 || !result){
  //       return {matkhau: true};
  //   }
  // }

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
     if (this.formdata.invalid) {
       return;
     } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          item_image:value.item_id,
          item_group_id:value.item_group_id,
          item_name:value.item_name,
          item_price:+value.item_price,
          item_mota:value.item_mota,
          item_trangthai:value.item_trangthai           
          };
          console.log(tmp);
        this._api.post('/api/sanpham/create-sanpham/  ',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          debugger;
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          item_image:data_image,
          item_group_id:value.item_group_id,
          item_name:value.item_name,
          item_price: +value.item_price,
          item_mota:value.item_mota,
          item_trangthai: value.item_trangthai,
          item_id:this.sanpham.item_id,             
          };
        this._api.post('/api/sanpham/update-sanpham',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/sanpham/delete-sanpham',{item_id:row.item_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.sanpham = null;
    this.formdata = this.fb.group({
      'item_id': ['', Validators.required],
      'item_group_id': ['', Validators.required],
      'item_name': ['', Validators.required],
      'item_price': ['', Validators.required],
      'item_mota': ['', Validators.required],
      'item_trangthai': ['', Validators.required],
    }); 
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.sanpham = null;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.formdata = this.fb.group({
      'item_group_id': ['', Validators.required], 
      'item_name': ['', Validators.required],
      'item_price': ['', [Validators.required]],
      'item_mota': ['', Validators.required],
      'item_trangthai': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/sanpham/get-by-id/'+ row.item_id).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.sanpham = res; 
          this.formdata = this.fb.group({
            'item_group_id': [this.sanpham.item_group_id, Validators.required],
            'item_name': [this.sanpham.item_name, Validators.required],
            'item_price': [this.sanpham.item_price, Validators.required],
            'item_mota': [this.sanpham.item_mota, Validators.required],
            'item_trangthai': [this.sanpham.item_trangthai, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  closeModal() {
    $('#createsanphamModal').closest('.modal').modal('hide');
  }
}

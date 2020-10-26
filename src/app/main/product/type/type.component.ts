import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent extends BaseComponent implements OnInit {
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
    });
    this.search();
  }

  loadPage(page) { 
    this._api.post('/api/loaisanpham/searchloai',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.sanphams = res.data;
  
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/loaisanpham/searchloai',{page: this.page, pageSize: this.pageSize, ten: this.formsearch.get('ten').value}).takeUntil(this.unsubscribe).subscribe(res => {
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
          item_group_name:value.item_group_name           
          };
          console.log(tmp);
        this._api.post('/api/loaisanpham/create-loai/  ',tmp).takeUntil(this.unsubscribe).subscribe(res => {
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
          item_group_name:value.item_group_name             
          };
        this._api.post('/api/loaisanpham/update-loai',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 
  onDelete(row) { 
    this._api.post('/api/loaisanpham/delete-loai',{item_group_id:row.item_group_id}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.sanpham = null;
    this.formdata = this.fb.group({
      'item_group_name': ['', Validators.required],
    }); 
  }
  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.sanpham = null;
    setTimeout(() => {
      $('#createloaiModal').modal('toggle');
      this.formdata = this.fb.group({
        'item_group_name': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }
  closeModal() {
    $('#createloaiModal').closest('.modal').modal('hide');
  }
}

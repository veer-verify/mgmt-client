import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { SiteService } from 'src/services/site.service';
import { AlertService } from 'src/services/alert.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-customer',
  templateUrl: './add-new-customer.component.html',
  styleUrls: ['./add-new-customer.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 1, transform: "translateX(0)" })
        )
      ]),
      transition(":leave", [
        style({ opacity: 1, transform: "translateX(0)" }), //apply default styles before animation starts
        animate(
          "500ms ease-in-out",
          style({ opacity: 0, transform: "translateX(100%)" })
        )
      ])
    ])
  ]
})
export class AddNewCustomerComponent implements OnInit {

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<boolean>();
 
  // showLoader: boolean;

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`customer`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddCustomer(false);
  //     }
  //   }
  // }

  closeAddCustomer() {
    this.newItemEvent.emit();
  }

  productForm: FormGroup;

  constructor(private fb:FormBuilder, private router:Router,
    private siteSer:SiteService,
    public alertSer:AlertService,
    private storageSer: StorageService
  ) {

    this.productForm = this.fb.group({
      "firstName": new FormControl('', Validators.required),
      "lastName": new FormControl('', Validators.required),
      "phoneNo": new FormControl('', Validators.required),
      "email": new FormControl('', Validators.required),
      "accountType": new FormControl(''),
      "contactPerson": new FormControl(''),
      "leadNo": new FormControl(0),
      "website": new FormControl(''),
      "fax": new FormControl(''),
      "remarks": new FormControl(''),
      "createdBy": new FormControl(''),
    });
  }

  ngOnInit(): void {
    // this.addQuantity()
    this.getMetadata();
  }

  quantities() : FormArray {
    return this.productForm.get("quantities") as FormArray
  }

  newQuantity(): FormGroup {
    return this.fb.group({
      addressType: '',
      country: '',
      state: '',
      district: '',
      pincode: '',
      area: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  getAccountDataRes: any =[];
  getMetadata() {
    let data = this.storageSer.get('metaData');
    for(let item of data) {
      if(item.typeName == "AccountType") {
        this.getAccountDataRes = item.metadata;
      }
    }
  }

  onSubmit() {
    if(!this.productForm.valid) return;
    this.siteSer.createAccountData(this.productForm.value).subscribe((res:any)=> {
      // console.log(res)
      this.newItemEvent.emit();
      if(res?.statusCode == 200 ) {
        this.alertSer.success(res?.message)
        // this.showLoader=false;
      } else {
        this.alertSer.error(res?.message)
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    }
    )
    // console.log(this.productForm.value);
  }

  address2: boolean = false;
  closeimg(e:any) {
    var x = e.target.parentNode.parentNode.parentNode;
    // console.log(x.children);
    x.style.display = 'none'
    // this.address2 = !this.address2;
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
  }


  billing_address:boolean = true;
  showBillingAddress(event:any) {
    var x = (event.target.value)
    if(x == 'yes'){
      this.billing_address = true
    }else{
      this.billing_address = false
    }
  }
}

import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { MetadataService } from 'src/services/metadata.service';
import { StorageService } from 'src/services/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.css'],
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

export class AddNewInventoryComponent implements OnInit {
  constructor(
    private router: Router,
    private inventorySer: InventoryService,
    private fb: FormBuilder,
    private metadataSer: MetadataService,
    public alertSer: AlertService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private storageSer: StorageService
  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();

  // @Output() newUser = new EventEmitter<any>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`user`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddUser(false);
  //     }
  //   }
  // }
  // error=false;


  UserForm: any =  FormGroup;

  inventoryBody = {
    inventory: {
      name: null,
      itemCode: null,
      brand: null,
      model: null,
      department: null,
      createdBy: null,
      remarks: null
    },

    quantity: null,
    serialnos: '',

    warranty: {
      startDate: null,
      endDate: null,
      createdBy: null,
      remarks: null
    }
  }

  // email: string = "";

  productData: any;
  orderIds: any;
  user: any;
  ngOnInit() {
    this.UserForm = this.fb.group({
      'name': new FormControl('', Validators.required),
      'itemCode': new FormControl('', Validators.required),
      'brand': new FormControl('', Validators.required),
      'model': new FormControl('', Validators.required),
      'department': new FormControl('', Validators.required),
      'remarks': new FormControl(''),

      'quantity': new FormControl('', Validators.required),
      'serialnos': new FormControl(''),

      'wremarks': new FormControl(''),
      'startDate': new FormControl(''),
      'endDate': new FormControl(''),

      'warrantyDetail': new FormControl(''),

      // 'partType': new FormControl(''),
      // 'partCategory': new FormControl(''),
      // 'partCode': new FormControl(''),
      // 'buildType': new FormControl('')
    });

    this.listProduct();
    this.user = this.storageSer.get('user');
  }

  listProduct() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      this.getMetadata();
      this.productData = res;
      // console.log(this.productData);
    })

    // this.inventorySer.listOrders().subscribe((res: any) => {
    //   this.orderIds = res;
    // })
  }


  // itemCode: any = null;
  // brand: any = null;
  // model: any = null;
  // name: any = null;

  // itemCodeBody = {
  //   partType: null,
  //   partCategory: null,
  //   partCode: null,
  //   buildType: null
  // }



  // listItemCode() {
  //   this.inventorySer.listItemCode(this.itemCodeBody).subscribe((res: any) => {
  //     // console.log(res);
  //     this.itemCode = res?.code;
  //     if(res?.code == null) {
  //       Swal.fire({
  //         icon: 'warning',
  //         title: 'No data!',
  //         text: 'Please add data in product master',
  //       })
  //     } else if(res?.code != null) {
  //       let itemBrandBody = {
  //         itemCode: res?.code,
  //         brand: null
  //       }

  //       this.inventorySer.listBrandAndModel(itemBrandBody).subscribe((res: any) => {
  //         this.brand = res?.brand;
  //       });

  //       this.inventorySer.listInventoryByItemCode(itemBrandBody).subscribe((res: any) => {
  //         this.name = res;
  //       })
  //     }
  //   })
  // }

  itemCodes: any;
  getItemCode(data: any) {
    let x = encodeURIComponent(data?.materialDescription);
    this.inventorySer.getItemCode(data).subscribe((res: any) => {
      this.itemCodes = res;
    })
  }

  brandNames: any = [];
  listInventoryByItemCode(data: any) {
    this.inventorySer.listInventoryByItemCode(data).subscribe((res: any) => {
      this.brandNames = res;
    })
  }

  modelNames: any;
  listBrandAndModel(data: any) {
    // console.log(data)
    // this.inventorySer.listBrandAndModel(data).subscribe((res: any) => {
    //   console.log(res);
    //   this.modelNames = res?.brand;
    // })

    this.modelNames = data
  }

  partType: any;
  partCategory: any;
  partCode: any;
  buildType: any;
  getMetadata() {
    this.metadataSer.getMetadata().subscribe((res: any) => {
      for(let item of res) {
        if(item.type == 'part_type') {
          this.partType = item.metadata;
        } else if(item.type == 'part_category') {
          this.partCategory = item.metadata;
        } else if(item.type == 'part_code') {
          this.partCode = item.metadata;
        } else if(item.type == 'build_type') {
          this.buildType = item.metadata;
        }
      }
    })
  }

  closeAddUser() {
    this.newItemEvent.emit();
  }

  openAnotherForm(newform:any) {
    this.newItemEvent.emit();
    this.storageSer.set('opennewform', newform);
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'N';
  submit() {
    this.inventoryBody.inventory.name = this.inventoryBody.inventory.itemCode;
    if(this.UserForm.valid) {
      this.alertSer.wait();
      this.inventoryBody.inventory.createdBy = this.user?.UserId;
      this.inventoryBody.warranty.createdBy = this.user?.UserId;
      if(this.inventoryBody.serialnos == '') {
        this.inventoryBody.serialnos = this.arr;
      } else {
        // this.inventoryBody.serialnos = this.inventoryBody.serialnos?.split(',').map((value: any) => value.trim());
        this.arr.push(this.inventoryBody.serialnos?.split(',').map((value: any) => value.trim()));
        this.inventoryBody.serialnos = this.arr[0];
      }
      this.inventoryBody.warranty.startDate = this.datepipe.transform(this.inventoryBody.warranty.startDate, 'yyyy-MM-dd');
      this.inventoryBody.warranty.endDate = this.datepipe.transform(this.inventoryBody.warranty.endDate, 'yyyy-MM-dd');

      this.inventorySer.createInventory(this.inventoryBody, this.warrantyDetail).subscribe((res: any) => {
        // console.log(res);
        this.newItemEvent.emit();
        this.alertSer.success(res?.message);
      }, (err: any) => {
        if(err) {
          this.alertSer.error(err);
        }
      });
    }
    // console.log(this.inventoryBody);
  }

  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}

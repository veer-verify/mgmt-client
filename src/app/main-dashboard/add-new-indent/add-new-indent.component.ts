import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-indent',
  templateUrl: './add-new-indent.component.html',
  styleUrls: ['./add-new-indent.component.css'],
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
export class AddNewIndentComponent implements OnInit {
  constructor(
    private inventorySer: InventoryService,
    private router: Router,
    private fb: FormBuilder,
    public alertSer: AlertService,
    public datepipe: DatePipe,
    private storageSer: StorageService
  ) { }

  @Input() show: any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  UserForm: any =  FormGroup;

  inventoryBody = {
    ticketId: null,
    createdBy: null,
    items: [
      {
        itemCode: null,
        quantity: null
      }
    ],
    remarks: null
  }

  items: any = [];
  onTaskAdd(item: any) {
    // console.log(item);
    if(item?.itemCode == null || item?.quantity == null) {
      this.alertSer.error('Please fill all fields');
    } else {
      let takBody = {
        'itemCode': item.itemCode,
        'quantity': item.quantity
      }
      this.items.push(takBody);
      this.UserForm.get('itemCode').setValue(null);
      this.UserForm.get('quantity').setValue(null);
      this.UserForm.get('remarks').setValue(null);
    }
  }

  ticketIdFrmFr: any;
  user: any;
  ngOnInit() {
    this.UserForm = this.fb.group({
      'jobOrTicketId': new FormControl(''),
      'itemCode': new FormControl(''),
      'quantity': new FormControl(''),
      'remarks': new FormControl('')
    });

    // this.getVendor();
    this.getProducts();
    this.ticketIdFrmFr = this.storageSer.get('ticketId');
    this.user = this.storageSer.get('user');
  }

  vendorDetail: any;
  getVendor() {
    this.inventorySer.listVendors().subscribe((res: any) => {
      this.vendorDetail = res;
    })
  }

  productIds: any;
  getProducts() {
    this.inventorySer.listProduct().subscribe((res: any) => {
      this.productIds = res;
    })
  }

  closeIndent() {
    this.newItemEvent.emit();
  }

  submitted!: boolean;
  arr: any = [];
  warrantyDetail: any = 'No';
  submit() {
    if(this.UserForm.valid) {
      this.inventoryBody.createdBy = this.user?.UserId;
      if(this.items.length > 0) {
        this.alertSer.wait();
        this.inventoryBody.ticketId = this.ticketIdFrmFr?.ticketId;
        this.inventoryBody.items = this.items;
        this.inventorySer.createIndent(this.inventoryBody).subscribe((res: any) => {
          // console.log(res);
          this.newItemEvent.emit();
          this.alertSer.success(res?.message);
        }, (err: any) => {
          if(err) {
            this.alertSer.error(err);
          }
        });
      } else {
        this.alertSer.error('Please add atleast one task')
      }
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}

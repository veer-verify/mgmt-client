import { animate, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from 'src/services/alert.service';
import { InventoryService } from 'src/services/inventory.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-add-new-order',
  templateUrl: './add-new-order.component.html',
  styleUrls: ['./add-new-order.component.css'],
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
export class AddNewOrderComponent implements OnInit {

  constructor(
    private router: Router,
    private inventorySer: InventoryService,
    private fb: FormBuilder,

    public alertSer: AlertService,
    public datepipe: DatePipe,
    private storageSer: StorageService
  ) { }

  @Input() show:any;

  @Output() newItemEvent = new EventEmitter<any>();

  UserForm: any =  FormGroup;

  inventoryBody = {
    vendorId: null,
    createdBy: 1,
    remarks: null
  }

  // email: string = "";

  user: any;
  ngOnInit() {
    this.UserForm = this.fb.group({
      'vendorId': new FormControl('', Validators.required),
      'remarks': new FormControl(''),
    });

    this.getVendor();
    this.user = this.storageSer.get('user');
  }

  vendorDetail: any;
  getVendor() {
    // this.inventorySer.listVendors().subscribe((res: any) => {
    //   this.vendorDetail = res;
    // })
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
  warrantyDetail: any = 'No';
  submit() {
    // console.log(this.inventoryBody);
    // console.log(this.warrantyDetail);
    setTimeout(() => {
      this.newItemEvent.emit();
    }, 3000)

    if(this.UserForm.valid) {
      this.alertSer.wait();
      this.inventoryBody.createdBy = this.user?.UserId;
      this.newItemEvent.emit();
      this.inventorySer.createOrder(this.inventoryBody).subscribe((res: any) => {
        // console.log(res);
        this.alertSer.success(res?.message);
      }, (err: any) => {
        this.alertSer.error(err);
      });
    }
  }


  checkbox: boolean = false;
  onCheck() {
    this.checkbox = !this.checkbox;
  }

}

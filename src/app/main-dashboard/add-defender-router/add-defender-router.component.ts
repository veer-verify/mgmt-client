import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SiteService } from 'src/services/site.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-defender-router',
  templateUrl: './add-defender-router.component.html',
  styleUrls: ['./add-defender-router.component.css']
})
export class AddDefenderRouterComponent {
  constructor(private siteservice: SiteService, private fb:FormBuilder){

  }
  makes = [
    { value: 'UNV', viewValue: 'UNV' },
    { value: 'IC Realtime', viewValue: 'IC Realtime' }
  ];

  postions = [
    { value: 'Left', viewValue: 'Left' },
    { value: 'Front', viewValue: 'Front' },
    { value: 'Right', viewValue: 'Right' }
  ];

  createCenteralBox!:FormGroup;
  ngOnInit(){
    this.createCenteralBox=this.fb.group({
      cameraUnitId: new FormControl(''),
      make: new FormControl(''),
      serialNumber: new FormControl(''),
      ip: new FormControl(''),
      position: new FormControl('')

    })

  }

@Output() newItemEvent = new EventEmitter();




  close() {
    this.newItemEvent.emit();
  }

  sudmit(){
    this.siteservice.addRouterDetails(this.createCenteralBox.value).subscribe((res)=>{
      Swal.fire({
      title: "Router Details Submitted Successfully",
      text: "Saved to the Database, Thank you.",
      icon: "success",
      // timer: 3000
    });
    this.close();

  
  }, (err)=>{
    Swal.fire({
      title: "Router Details not submitted",
      text: "Sorry Please try again",
      icon: "error",
      // timer: 3000
    })


  })
  
  }

}

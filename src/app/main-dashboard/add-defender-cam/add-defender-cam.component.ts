import { animate, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SiteService } from 'src/services/site.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-defender-cam',
  templateUrl: './add-defender-cam.component.html',
  styleUrls: ['./add-defender-cam.component.css'],
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
export class AddDefenderCamComponent {
  constructor(private siteservice: SiteService, private fb:FormBuilder)
  
  {
   

  }

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
  
  makes = [
    { value: 'UNV', viewValue: 'UNV' },
    { value: 'IC Realtime', viewValue: 'IC Realtime' }
  ];

  postions = [
    { value: 'Left', viewValue: 'Left' },
    { value: 'Front', viewValue: 'Front' },
    { value: 'Right', viewValue: 'Right' }
  ];

@Output() newItemEvent = new EventEmitter();




  close() {
    this.newItemEvent.emit()
  }
  sudmit(){
    this.siteservice.addCamDetails(this.createCenteralBox.value).subscribe((res)=>{
      Swal.fire({
      title: "Camera Details Submitted Successfully",
      text: "Saved to the Database, Thank you.",
      icon: "success",
      // timer: 3000
    });
    this.close();

  
  }, (err)=>{
    Swal.fire({
      title: "Camera Details not submitted",
      text: "Sorry Please try again",
      icon: "error",
      // timer: 3000
    })


  })
  
  }

}

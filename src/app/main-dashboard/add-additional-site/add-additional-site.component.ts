import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'app-add-additional-site',
  templateUrl: './add-additional-site.component.html',
  styleUrls: ['./add-additional-site.component.css'],
  animations:[
    trigger("inOutPaneAnimation", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateX(100%)", }), //apply default styles before animation starts
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
export class AddAdditionalSiteComponent implements OnInit {

  // @Input() show:any;
  @Output() newItemEvent = new EventEmitter<boolean>();

  // @HostListener('document:mousedown', ['$event']) onGlobalClick(e: any): void {
  //   var x = <HTMLElement>document.getElementById(`additionalSite`);
  //   if (x != null) {
  //     if (!x.contains(e.target)) {
  //       this.closeAddAdditionalSite(false);
  //     }
  //   }
  // }



  addSiteForm: any =  FormGroup;


  checked = false;


  site = {
    verticals: "",
    customers: "",
    selectSite: "",
  }

  searchText: any;

  items = ['john', 'mark', 'cooper', 'henry', 'roben'];
  siteIdList = [ '3001', '3002', '3003', '3004'];

  constructor(private fb: FormBuilder, private userSer: UserService) { }

  filteredOptions!: Observable<any>;
  ngOnInit(): void {
    this.addSiteForm = this.fb.group({
      'userId': new FormControl(''),
      'userName': new FormControl(''),
      'verticals': new FormControl(''),
      'customers': new FormControl(''),
      'selectSite': new FormControl(''),
      'checked': new FormControl()
    });

    this.filteredOptions = this.searchTextboxControl.valueChanges
    .pipe(
      startWith<string>(''),
      map(name => this.filter(name))
    );
  }

  @ViewChild('search') searchTextBox!: ElementRef;

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues = [];
  data: string[] = [
    'US00010',
    'US00011',
    'US00012',
    'US00013',
    'US00014',
    'US00015',
  ]

  filter(name: string) {
    const filterValue = name.toLowerCase();
    this.selectFormControl.patchValue(this.selectedValues);
    let filteredList = this.data.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  closeAddAdditionalSite() {
    this.newItemEvent.emit();
  }

  submit(){
    // console.log(this.addSiteForm.value);
  }

}

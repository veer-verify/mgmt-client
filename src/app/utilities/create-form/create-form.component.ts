import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialog_input: any
  ) { }

  fields: Array<any> = new Array();
  arrayFields: Array<any> = new Array();
  ngOnInit(): void {
    // this.fields = Object.entries(this.object?.data).reduce((acc: any, [key, value]: any) => {
    //   acc.push({key, value});
    //   return acc;
    // }, []);

    this.dialog_input.body
    this.fields = Object.keys(this.dialog_input.body).filter((item) => !Array.isArray(this.dialog_input.body[item]));
    this.arrayFields = Object.keys(this.dialog_input.body).filter((item) => Array.isArray(this.dialog_input.body[item]));
  }

}

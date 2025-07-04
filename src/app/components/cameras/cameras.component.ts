import { Component } from '@angular/core';

@Component({
  selector: 'app-cameras',
  templateUrl: './cameras.component.html',
  styleUrls: ['./cameras.component.css']
})
export class CamerasComponent {


  tableData: any = [];
  newTableData: any = [];
  showLoader: boolean = false;
  searchText: any;

  openCamear:boolean = false;
  openCamera(value:string) {
    if(value === 'camera') {
      this.openCamear = true
    }
  
  }

  closeCamera(value:string) {
    if(value === 'camera') {
      this.openCamear = false
    }
   
  }

  sorted = false;
  sort(label:any){
    this.sorted = !this.sorted;
    var x = this.tableData;
    if(this.sorted==false){
      x.sort((a:string, b:string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    }else{
      x.sort((a:string, b:string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}

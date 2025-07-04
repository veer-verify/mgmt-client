import { Component } from '@angular/core';
import { SiteService } from 'src/services/site.service';

@Component({
  selector: 'app-defender',
  templateUrl: './defender.component.html',
  styleUrls: ['./defender.component.css']
})
export class DefenderComponent {
  constructor(private siteservice: SiteService){

  }

  showMenu!:boolean;
  ngOnInit(){
    this.showDefenderDetails()
    // this.siteservice.shoowMenu.subscribe({
    //   next: (res:any)=>{
    //     this.showMenu=res;
    //   }
    // })
  }

  headerItems : Array<string>=["S.No", "Unit Id", "Make", "Registercode", "IP", "Position", "Router SN", "IMSI" ];

  defenderDetails: Array<any>=[]

  showDefenderDetails(){
    this.siteservice.showDefenderDetails().subscribe((res:any)=>{
      console.log(res)
      this.defenderDetails=res
    })
  }

  showCamForm:boolean=false;

  showRouterForm:boolean=false;


  openDefenderForm(type:string) {
    if (type=='showCamForm'){
      this.showCamForm=true;
    }
     if(type=='showRouterForm'){
      this.showRouterForm=true;
    }
  }

  close() {
    this.showCamForm=false;
    this.showRouterForm=false;
  }



}

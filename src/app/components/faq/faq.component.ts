import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdvertisementsService } from 'src/services/advertisements.service';
import { AlertService } from 'src/services/alert.service';
import { AssetService } from 'src/services/asset.service';
import { SiteService } from 'src/services/site.service';
import { StorageService } from 'src/services/storage.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent {

  @Output() newItemEvent = new EventEmitter<boolean>()
  
  constructor(
    private assetService: AssetService,
    private siteSer: SiteService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public alertSer: AlertService,
    private storageSer: StorageService,
    private adver:AdvertisementsService
  ) { }

  searchText!: string;
  tableLoader: boolean = false;
  user: any;
  selectedName:any
  newAdId: string | null = null;
  interval: any;
  ngOnInit() {
    
    this.user = this.storageSer.get('user');
    this.listIssueInfo();
    this.category()
    this.interval = setInterval(() => {
      this.changeColor();
    }, 1000);
    
 this.listDevice()
  }
  colors: string[] = ['#084982', '#D34135'];
  currentColorIndex: number = 0;
  changeColor(): void {
    // Cycle through the colors
    this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
  }

  listDevice(){

    this.adver.getSiteslist().subscribe((res:any)=>{
      this.alldevicelist=res.devicesList.sort((a:any, b:any) => a.sitename.localeCompare(b.sitename));
     
   })

  }


    /* searches */
    siteSearch: any;
    searchSites(event: any) {
      this.siteSearch = (event.target as HTMLInputElement).value
    }
    siteSearch1: any;
    searchSites1(event: any) {
      this.siteSearch1 = (event.target as HTMLInputElement).value
    }
    
    
  siteData:any=[]
  showLoader:boolean = false;
  newlistAdsInfoData:any = [];
  listAdsInfoData:any;

  Category:any = 'All';
  deviceId:any = "All";
  adName:any = 'All';
  devices:any;

  ticketStatusObj = {
    fromDate: null,
    toDate:null
  }

  siteName:any='All'

  filterData:any

  filter(type:any) {


    let siteName:any;
    let Category:any;
    let subcategoryId:any;
    let deviceId:any;

  
   
    this.Category == 'All' ? Category =  null : Category = this.Category;
    this.subcategoryId == 'All'? subcategoryId = null : subcategoryId = this.subcategoryId ;
    this.deviceId == 'All'? deviceId = null : deviceId = this.deviceId;
    this.siteName == 'All'? siteName = null : siteName = this.siteName;

 
   
   
      this.adver.listIssueInfo({Category: Category ,deviceId:deviceId, subcategoryId: subcategoryId,toDate: this.ticketStatusObj.toDate,fromDate:this.ticketStatusObj.fromDate,siteId: siteName}).subscribe((res:any)=> {
        this.newSiteData = res.IssueInfo.sort((a:any,b:any)=>{

          return a.statusId>b.statusId?1 :-1

          })

       
      

        if(!deviceId) {
          this.newDeviceData = res.IssueInfo.flatMap((item: any) => item.deviceInfo);
        }
      })
    
  }


  listDevices(site: any) {
    this.adver.listAdsInfo(site).subscribe((res: any) => {
      this.devices = res.sites.flatMap((item:any)=>item.devices);
    })
  }


  advertisements: any = [];
  newAdvertisements: any = [];
 

  deviceData:any = []
  newDeviceData:any = []
  approachData: any =[]
  commentData: any = []
  commentDataArray:any=[]
  approachDataArray:any=[]
  newSiteData: any = []

  listIssueInfo() {
    this.tableLoader = true;
    this.adver.listIssueInfo().subscribe((res:any)=> {
     
      this.getMetadata();
      this.tableLoader = false
      this.siteData = res.IssueInfo;
      this.newSiteData = this.siteData.sort((a:any,b:any)=>{
      return a.statusId>b.statusId?1 :-1
      })
      // this.deviceData = this.siteData.flatMap((item:any) => item.deviceInfo);
      // this.newDeviceData = this.deviceData;
      // this.commentData = this.newSiteData.map((item:any)=>{
      //   item.commentsCount});
      // this.approachData = this.newSiteData.map((item:any)=>{
      //   item.approachCount});
      //   console.log(this.commentData)

    })
  }



  subCategoryList:any=[]
 subcategoryId:any="All"
 devicelist:any=[]

 filteritem:any;
  openSubcategoryList(item:any) {
    
   this.filteritem=item;
    this.subcategoryId =null
    if(item=='All'){
      
      this.subCategoryList=[]
    }
    
    this.subCategoryList = item.subCategoryList
  }

  comment:any
  updateAdForComment() {
    let updateDataForComment = {
      issueId :this.currentcomment.issueId,
      createdBy:this.user?.UserId,
      commentInfo :this.comment
     }
    this.adver.addCommentForIssue(updateDataForComment).subscribe((res:any)=> {
      if(res?.statusCode == 200 ) {
        this.alertSer.success(res?.message)
        if(this.category){
          this.filter(this.category)
        }
        else
        {
          this.listIssueInfo()
      }
      
        this.adver.listCommentsForIssueId(this.currentcomment).subscribe((res:any)=>{
          this.commentDataArray =res.data
          this.comment=null;
       })
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  currentItem1:any
  @ViewChild('openCommentDialog') openCommentDialog = {} as TemplateRef<any>;
  showAddComment(item:any,index:any) {

    this.currentcommentindex=index
    this.currentcomment=item;
    this.dialog.open(this.openCommentDialog,{
      disableClose:true
    })
    this.comment=null;
  }

  showAddComment1(){
    this.dialog.open(this.openCommentDialog,{
      disableClose:true
    })
    this.comment=null;
  }
  
  Approach:any;
  @ViewChild('openApproachDialog') openApproachDialog = {} as TemplateRef<any>;
  showAddApproach(item:any,index:any) {

    this.currentcommentindex=index
    this.Approach=null
    this.currentApproach=item;
    this.dialog.open(this.openApproachDialog,{
      disableClose:true
    })
  }
  showAddApproach1() {
    this.Approach=null
    this.dialog.open(this.openApproachDialog,{
      disableClose:true
    })
  }

  @ViewChild('usedItemsDialog') usedItemsDialog = {} as TemplateRef<any>;
  currentcommentindex:any;

  openView(item:any,index:any){

   
   this.currentcommentindex=index
    this.currentcomment=item;
    // console.log(this.currentcomment)
    this.adver.listCommentsForIssueId(item).subscribe((res:any)=>{
       this.commentDataArray =res.data
    })
    this.dialog.open(this.usedItemsDialog,{
      disableClose:true
    })
  }

  currentApproach:any;
  @ViewChild('approachItemsDialog') approachItemsDialog = {} as TemplateRef<any>;
  openViewApproach(item:any,index:any) {
    this.currentcommentindex=index
    this.currentApproach=item
    this.adver.listApproachesForIssueId(item).subscribe((res:any)=>{
      this.approachDataArray = res.data;
   })
    this.dialog.open(this.approachItemsDialog,{
      disableClose:true
    })
  }

  @ViewChild('deviceItemsDialog') deviceItemsDialog = {} as TemplateRef<any>;
  listDevicesForIssue(item:any,index:any) {
    this.currentcommentindex=index
    this.currentDevice=item
   
    this.adver.listDevicesForIssueId(item).subscribe((res:any)=>{

      if(res.statusCode==200){
        this.deviceDataarray = res.data;
      }
    
   })
    this.dialog.open(this.deviceItemsDialog,{
      disableClose:true
    })
  }
  siteinfo:any;
  currentDevice:any;
  addDevice:any={}
  alldevicelist:any;
  deviceDataarray:any=[]
  deviceinfo:any 
  date:any;
  remarksDev:any
  minDate: Date = new Date();



   siteDevices:any;
   totalDevices:any
  filterDevices(item:any): void {

 this.adver.getSites(item).subscribe((res:any)=>{
  // console.log(res)

  this.siteDevices=res.devicesList.flatMap((item:any)=>item.deviceList)
 
})

    
   
  }





  @ViewChild('deviceAssetDialog') deviceAssetDialog = {} as TemplateRef<any>;

  sitelist:any
  showAddDevice(item:any,index:any){

    this.currentcommentindex=index
    this.addDevice=item;
   

    this.adver.getSiteslist().subscribe((res:any)=>{
       this.alldevicelist=res.devicesList.sort((a:any, b:any) => a.sitename.localeCompare(b.sitename));
      
    })

    this.dialog.open(this.deviceAssetDialog,{
      disableClose:true
    })
  }

  siteId:any;
  unitId:any;

updateDevice(){

  if(this.deviceinfo){

    // this.unitId = this.deviceinfo.deviceId; // Extract unitId from selected device
    // this.siteId = this.deviceinfo.siteId;
    this.unitId=this.deviceinfo;
    this.siteId=this.siteinfo;

  let tempDevice ={
    deviceId:this.unitId,
    issueId :this.addDevice.issueId,
    dateOfEffected:this.date,
    remarks:this.remarksDev,
    siteId:this.siteId
  }



  this.adver.addDevicesforIssueId(tempDevice).subscribe((res:any)=>{

    if(res.statusCode=200){
      this.alertSer.success(res?.message)
      
      if(this.category){
        this.filter(this.category)
      }
      else
      {
        this.listIssueInfo()
    }
     
    

      if(this.addDevice){

        this.adver.listDevicesForIssueId(this.addDevice).subscribe((res:any)=>{
          this.deviceDataarray = res.data;
       })
      }
else{
  this.adver.listDevicesForIssueId(this.currentDevice).subscribe((res:any)=>{
    this.deviceDataarray = res.data;
 })
}
 

    }
    else{
      this.alertSer.error(res?.message)
   

    }
    

 
    this.deviceinfo=null
    this.date=null
    this.remarksDev=null
  },(error:any)=> {
    this.alertSer.error(error?.err?.message)
  })
}
}

currentItem:any
currentcomment:any;
currentcomment1:any = []

@ViewChild('viewitemsDialog') viewitemsDialog = {} as TemplateRef<any>;
  openViewPopup(item:any,index:any) {

    this.currentcommentindex=index
    // console.log(item)
    this.currentcomment1 = item;
    this.dialog.open(this.viewitemsDialog,{
      disableClose:true
    }); 
  }

  @ViewChild('editAssetDialog') editAssetDialog = {} as TemplateRef<any>;

  openEditPopupp(item:any,index:any) {
    this.currentcommentindex=index
    this.subCategoryList = this.categoryList.filter((el:any)=>{
      return el.catId==item.categoryId
    })[0].subCategoryList
    this.currentItem = JSON.parse(JSON.stringify(item))
    this.dialog.open(this.editAssetDialog,{
      disableClose:true
    });
  }
  
  isStatusChanged: boolean = false;
  
  updateAd() {
this.showLoader = true
    // console.log(this.currentItem.subCategoryId)
 
if(!this.currentItem.subCategoryId){

  this.alertSer.error("Please Select SubCategory")
}
else{

  let updateData = {
    issueId :this.currentItem.issueId ,
    modifiedBy:this.user?.UserId,
    issueName:this.currentItem.issueName,
    issueCategoryId:this.currentItem.categoryId,
    issueSubCategoryId: this.currentItem.subCategoryId,
    issueStatus:this.currentItem.statusId,
    issueDescription: this.currentItem.issueDescription,
   
  }

  this.adver.updateIssue(updateData,this.selectedFile).subscribe((res:any)=> {
    if(res?.statusCode == 200 ) {
      this.showLoader = false;
      // this.filter(this.currentItem)
     
      this.alertSer.success(res?.message)
      if(this.filteritem){

       
        this.filter(this.filteritem.catId)
      }
      else
      {
       
        this.listIssueInfo()
    }

    this.dialog.closeAll()
    }
    else{
      this.alertSer.error(res?.message)
    }
  },(error:any)=> {
    this.alertSer.error(error?.err?.message)
  })
}
    

  }


  categoryList:any = [];
  category() {
    this.adver.category().subscribe((res:any) => {
    this.categoryList = res.categoryList
    })
  }

  @ViewChild('deleteAssetDialog') deleteAssetDialog = {} as TemplateRef<any>;
  deleteRow: any;
  openDeletePopup(item: any,index:any) {
    this.currentcommentindex=index
    this.currentItem = item;
    this.dialog.open(this.deleteAssetDialog,{
      disableClose:true
    });
  }

  confirmDeleteRow() {
    this.adver.delete(this.currentItem).subscribe((res:any)=> {
    
      if(res?.statusCode == 200 ) {
        this.filter(this.currentItem);
        this.alertSer.success(res?.message)
       
        if(this.category){
          this.filter(this.category)
        }
        else
        {
          this.listIssueInfo()
      }
      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })
  }

  Remarks:any;
  updateAdForApproach(){
    let updateDataForComment = {
      issueId :this.currentApproach.issueId,
      createdBy:this.user?.UserId,
      approachName :this.Approach,
      remarks:this.Remarks
    }
    this.adver.addApproachForIssue(updateDataForComment).subscribe((res:any)=> {
      if(res?.statusCode == 200 ) {
        this.alertSer.success(res?.message)
      
        if(this.category){
          this.filter(this.category)
        }
        else
        {
          this.listIssueInfo()
      }
     
        this.adver.listApproachesForIssueId(this.currentApproach).subscribe((res:any)=>{
          this.approachDataArray =res.data
       })
        this.Approach=null;
        this.Remarks=null;
      }
      else{
        this.alertSer.error(res?.message)

      }
    },(error:any)=> {
      this.alertSer.error(error?.err?.message)
    })

  }

  /* file upload */
  selectedFile: any=null
  // selectedFiles: any = [];

  onFileSelected(event: any) {
  
    let x = event.target.files[0];
 
  if(x.size<=5242880){

    if(typeof(event) == 'object') {
      this.selectedFile = x.size<=5242880 ? x : null;
    }

  }
  else{
    
    this.alertSer.error("File Size should be lessthan 5MB")
  }
    
  }


  getStatusColor(status: any): any {
    switch (status) {
      case 1:
        return 'green';
      case 2:
        return '#FD6327';
      case 4:
        return 'violet';
      case 5:
        return '#084982';
      case 6:
        return 'red';
      default:
        return 'black'; // fallback color
    }
  }


  editingIndex: number | null = null;
approachedit:any;
currentapp:any;
ApproachId:any;

  openEditapproach(item:any,index:any,currentApp:any){

  this.ApproachId=item.approachId;
  this.editingIndex = index;
  this.approachedit=item.approachName;
  this.currentapp=currentApp.issueId
   
  }




  // Enable editing mode


  saveEdit(): void {

    let updateDataForComment = {
      issueId :this.currentapp,
      ApproachId:this.ApproachId,
      createdBy:this.user?.UserId,
      approachName :this.approachedit,
      remarks:null
    }

    
    this.adver.EditApproachforIssue(updateDataForComment).subscribe((res:any)=>{

      this.alertSer.success(res?.message)
      this.editingIndex=null

      this.adver.listApproachesForIssueId(this.currentApproach).subscribe((res:any)=>{
        this.approachDataArray =res.data
     })

    
    })

 
 
  }









  getLoaderFromChild(data: boolean) {
    this.tableLoader = data;
  }

  getAdsFromChild(data: any) {
    this.newlistAdsInfoData = data;
  }

  getSearchFromChild(data: any) {
    this.searchText = data;
  }

  deviceType: any;
  deviceMode: any;
  addStatus: any;
  workingDays: any;
  model_object_type:any
  getMetadata() {
    let data = this.storageSer.get('metaData');
    // console.log(data)
    data?.forEach((item: any) => {
      if(item.type == 2) {
        this.deviceType = item.metadata;
      } else if(item.type == 1) {
        this.deviceMode = item.metadata;
      } else if(item.type == 111) {
        this.addStatus = item.metadata;
      } else if(item.type == 6) {
        this.workingDays = item.metadata;
      }
      else if(item.type == 7) {
        this.model_object_type = item.metadata;
      }
    });
  }

  addRule:boolean = false;
  final:any
  showAsset: boolean = false;

  showAddAsset(type: any , value?:any) {
    // console.log(value)
   this.final =  value 
    if (type == 'asset') {
      this.showAsset = true;
    }
    if (type == 'rule') {
      this.addRule = true;
    }
  }

  lastSubmittedItemId:any
  closenow(type: String) {
    if (type == 'asset') {
      this.showAsset = false;
    }
    if (type == 'rule') {
      this.addRule = false;
    }
  }

  /* Edit Asset Status */
  @ViewChild('editStatusDialog') editStatus = {} as TemplateRef<any>;
  openEditStatus(data: any) {
    this.currentItem = data;
    this.dialog.open(this.editStatus,{
      disableClose:true
    });
  }

  changeAssetStatus() {
    this.assetService.updateAssetStatus(this.currentItem).subscribe((res: any) => {
      this.alertSer.success(res.message);
    }, (err: any) => {
      if(err) {
        this.alertSer.error(err);
      };
    });
  }


  /* add actions */
 

  originalObject: any;
  changedKeys: any[] = [];

  onDateChange(e: any) {
    let x = e.targetElement.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onSelectChange(event: any) {
    let x = event.source.ngControl.name;
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  onInputChange(event: any) {
    let x = event.target['name'];
    if(!(this.changedKeys.includes(x))) {
      this.changedKeys.push(x);
    }
  }

  confirmEditRow() {
    this.originalObject = {
      "id": this.currentItem.id,
      "deviceModeId": this.currentItem.deviceModeId,
      "playOrder": this.currentItem.playOrder,
      "modifiedBy": 1,
      "fromDate": this.currentItem.fromDate,
      "toDate": this.currentItem.toDate,
      "active": this.currentItem.active,
      "status": this.currentItem.status
    };

    this.originalObject.fromDate = this.datepipe.transform(this.currentItem.fromDate, 'yyyy-MM-dd');
    this.originalObject.toDate = this.datepipe.transform(this.currentItem.toDate, 'yyyy-MM-dd');
    this.assetService.modifyAssetForDevice({asset: this.originalObject, updProps: this.changedKeys}).subscribe((res: any) => {
      // console.log(res);
      this.alertSer.success(res?.message);
    }, (err: any) => {
        this.alertSer.wait();
    })
  }



  deleteRow1(item: any, i: any) {
    // console.log(item);
    setTimeout(() => {
      this.newlistAdsInfoData.splice(i, 1);
    }, 1000);
  }

  @ViewChild('addPlayerDialog') addPlayerDialog: any = ElementRef;
  openPlayerDialog(data: any) {
    // console.log(data)
    this.currentItem = data;
    this.dialog.open(this.addPlayerDialog,{
      disableClose:true
    });
  }

  sorted = false;
  sort(label: any) {
    this.sorted = !this.sorted;
    var x = this.newSiteData;
    if (this.sorted == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

  sorted1 = false;
  sort1(label: any) {
    this.sorted1 = !this.sorted1;
    var x = this.commentDataArray;
    if (this.sorted1 == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }


  sorted2 = false;
  sort2(label: any) {
    this.sorted2 = !this.sorted2;
    var x = this.approachDataArray;
    if (this.sorted2 == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }
  
  sorted3 = false;
  sort3(label: any) {
    this.sorted3 = !this.sorted3;
    var x = this.deviceDataarray;
    if (this.sorted3 == false) {
      x.sort((a: string, b: string) => a[label] > b[label] ? 1 : a[label] < b[label] ? -1 : 0);
    } else {
      x.sort((a: string, b: string) => b[label] > a[label] ? 1 : b[label] < a[label] ? -1 : 0);
    }
  }

}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../environments/environment';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteService {


  cameras_sub: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private storageSer: StorageService) { }

  createSite(payload: any) {
    let url = `${environment.sitesUrl}/addSite_1_0`;
    let user = this.storageSer.get('user');

    payload.createdBy = user.UserId;
    return this.http.post(url, payload)
  }


  getSitesListForUserName(payload?: any) {
    let url = `${environment.sitesUrl}/getSitesListForUserName_2_0/`;
    let user = this.storageSer.get('user');

    let params = new HttpParams();

    if (user) {
      params = params.set('userName', user?.UserName);
    }

    if (payload?.siteStatus) {
      params = params.set('siteStatus', payload?.siteStatus);
    }
    
    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    return this.http.get(url, ({ params: params }));
  }

  getSitesListForAssign(payload: any) {
    let url = `${environment.sitesUrl}/getSitesListForUserName_2_0`;
    let params = new HttpParams().set('userName', payload?.User_Name);
    return this.http.get(url, { params: params });
  }


  gettimeZones() {
    return this.http.get("assets/JSON/timezones.json");
  }

  getSiteFullDetails(payload: any) {
    let url = `${environment.sitesUrl}/getSiteFullDetails_1_0/${payload.siteId}`;
    return this.http.get(url)
  }

  updateSiteDetails(payload: any) {
    let url = `${environment.sitesUrl}/updateSiteDetails_1_0/${payload.siteId}`;
    return this.http.put(url, payload)
  }

  // getCamerasForSiteId(payload?: any) {
  //   console.log(payload)
  //   let url = environment.sitesUrlForCamera + '/camera/getCameraShortDetailsForSiteId_1_0';
  //   // let url = `http://192.168.0.127:8080/camera/getCameraFullDetailsForSiteId_1_0/${payload.siteId}`;
  //   let params = new HttpParams().set('siteId', payload);
  //   return this.http.get(url, {params:params});
  // }

  getCamerasForSiteId(cameraId: any) {
    let url = `${environment.sitesUrl}/getCamerasForSiteId_1_0/${cameraId}`;
    return this.http.get(url);
  }

  getEngineer(id: any) {
    let url = environment.sitesUrl + '/getEngineerdetails_1_0/' + `${id}`;
    return this.http.get(url);
  }

  getCentralbox(payload: any) {
    let url = `${environment.sitesUrl}/getCentralBox_1_0/${payload.siteId}`;
      
        return this.http.get(url);
  }
 
  addCentralBox(payload: any) {
    let url = `${environment.sitesUrl}/addCentralBox_1_0`;
    let user = this.storageSer.get('user');

    payload.createdBy = user.UserId;
    return this.http.post(url, payload);
  }

  createCamera(payload: any) {
    let url = `${environment.sitesUrl}/addCamera_1_0`;
    return this.http.post(url, payload)
  }

  updateCamera(payload: any,payload1:any) {

    let url = `${environment.sitesUrl}/updateCameraData_1_0/${payload1}`;
    // delete payload.httpUrl;
    return this.http.put(url, payload)
  }

  showDefenderDetails(): Observable<any> {
    let url = environment.sitesUrl + "/showDefenderDetails";
    return this.http.get(url);
  }

  addCamDetails(payload: any) {
    let url = environment.sitesUrl + "/addDefenderCamDetails";
    return this.http.post(url, payload);
  }

  addRouterDetails(payload: any) {
    let url = environment.sitesUrl + "/addDefenderCamDetails";
    return this.http.post(url, payload);
  }


  listSiteServices(payload: any) {
    let url = `${environment.sitesUrl}/listSiteServices_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url, { params: params });
  }

  updateSiteServices(payload: any) {
    let url = `${environment.sitesUrl}/updateSiteServices_1_0/${payload.siteId}`;
    return this.http.post(url, payload)
  }


  addSiteCheckList(payload: any) {
    let url = `${environment.sitesUrl}/addSiteCheckList_1_0/`;
    return this.http.post(url, payload)
  }

  listSiteCheckList(payload: any) {
    let url = `${environment.sitesUrl}/listSiteCheckList_1_0/`;
    let user = this.storageSer.get('user');

    let params = new HttpParams();
    params = params.set('userId', user?.UserId);

    if (payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }
    if (payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if (payload?.validationChecklistId) {
      params = params.set('validationChecklistId', payload?.validationChecklistId);
    }
    return this.http.get(url, { params: params })
  }

  listSiteCheckListHistory(payload: any) {
    let url = `${environment.sitesUrl}/listSiteCheckListHistory_1_0/`;
    let params = new HttpParams();
    if (payload?.deviceId) {
      params = params.set('deviceId', payload?.deviceId);
    }
    if (payload?.validationChecklistId) {
      params = params.set('validationChecklistId', payload?.validationChecklistId);
    }
    return this.http.get(url, { params: params })
  }

  updateSiteCheckList(payload: any) {
    let url = `${environment.sitesUrl}/updateSiteCheckList_1_0/`;
    let user = this.storageSer.get('user')
    let myObj = {
      "validationChecklistId": payload?.validationChecklistId,
      "deviceId": payload?.deviceId,
      "scope": payload?.scope,
      "configured": payload?.configured,
      "working": payload?.working,
      "remarks": payload?.remarks,
      "modifiedBy": user?.UserId

    }
    return this.http.put(url, myObj)
  }

  getCentralBoxForSiteId(payload: any) {
    let url = `${environment.sitesUrl}/getCentralBox_1_0/${payload?.siteId}`;
 
    return this.http.get(url, payload)
  }

  getValidationCheckList() {
    let url = `${environment.sitesUrl}/getValidationCheckList_1_0/`;
    return this.http.get(url)
  }

  listSupportAdminUsers() {
    let url = `${environment.authUrl}/listSupportAdminUsers_1_0`;
    let params = new HttpParams();
    params = params.set('type', '35');
    return this.http.get(url, { params: params })
  }

  // NewApis

  getValidationCheckListForCategory(payload: any) {
    let url = `${environment.sitesUrl}/getValidationCheckList_1_0/`;
    let params = new HttpParams();
    if (payload?.name) {
      params = params.set('category', payload?.name);
    }
    // if(payload?.deviceId) {
    //   params = params.set('deviceId', payload?.deviceId);
    // }
    // if(payload?.validationChecklistId) {
    //   params = params.set('validationChecklistId', payload?.validationChecklistId);
    // }
    return this.http.get(url, { params: params })
  }

  updateSiteCheckListFor(payload: any) {
    let url = `${environment.sitesUrl}/updateSiteCheckList_1_0/`;
    let user = this.storageSer.get('user')

    return this.http.put(url, payload)
  }



  getCameraEventsConfigData(payload: any) {
    let url = `${environment.sitesUrl}/getCameraEventsDataforSiteId_1_0`;
    let params = new HttpParams();
    params = params.set('siteId', payload);
    return this.http.get(url, { params: params });
  }

  addCameraEventsConfigData(payload: any) {
    let url = `${environment.sitesUrl}/addCameraEventsConfigData_1_0`;
    return this.http.post(url, payload)
  }

  updateCameraEventsConfigData(payload: any) {
    let url = `${environment.sitesUrl}/updateCameraEventsConfigData_1_0/${payload?.cameraId}`;
    return this.http.put(url, payload)
  }

  getAccountData() {
    let url = `${environment.sitesUrl}/getAccountData_1_0`
    return this.http.get(url)
  }

  createAccountData(payload: any) {
    let url = `${environment.sitesUrl}/createAccountData_1_0`;
    let user = this.storageSer.get('user')
    payload.createdBy = user?.UserId
    return this.http.post(url, payload)
  }

  updateAccountData(payload: any) {
    let url = `${environment.sitesUrl}/updateAccountData_1_0`;
    let user = this.storageSer.get('user');
    let params = new HttpParams();
    params = params.set('accountId', payload?.accountId);
    payload.modifiedBy = user?.UserId
    return this.http.post(url, payload, {params: params})
  }


   updateCentralbox(payload:any){

    let url = `${environment.sitesUrl}/updateCentralBox_1_0`;
    let user = this.storageSer.get('user');
    payload.modifiedBy = user?.UserId;
    return this.http.post(url,payload);

   }
  getS3BucketNames(){

    let url =`${environment.authUrl}/getS3BucketNames_1_0`;
  
    return this.http.get(url);

  }
  creates3Defaultpath(payload:any){

    let url =`${environment.authUrl}/addS3defaultPath_1_0`;
    let user = this.storageSer.get('user');
    // payload.createdBy = user?.UserId;
    return this.http.post(url,payload);

  }


}

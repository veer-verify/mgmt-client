import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  login_loader_sub: BehaviorSubject<any> = new BehaviorSubject(false);
  table_loader_sub: BehaviorSubject<any> = new BehaviorSubject(false);
  current_sub: BehaviorSubject<any> = new BehaviorSubject(null);
  // edit_sub: BehaviorSubject<any> = new BehaviorSubject({ data: {}, dropdownData: [], updateUrl: '', getUrl: '' });

  private readonly key = "verifai";

  constructor(private http: HttpClient) {}

  getMetadataByType(data: any): any {
    let metaData: any = this.get('metaData');
    return metaData?.filter((item: any) => item.type === data);
  }

  getMetaDataValue(type: string, key: number) {
    let data: any = JSON.parse(localStorage.getItem('metaData')!);
    return data?.filter((item: any) => item.typeName == type)[0].metadata.filter((el: any) => el.keyId == key)[0].value
  }

  getMetaDataArray(type: string) {
    let data: any = JSON.parse(localStorage.getItem('metaData')!);
    return data?.filter((item: any) => item.typeName == type)[0]?.metadata
  }

  // getData(url: string, params?: string) {
  //   return this.http.get(`${environment.baseUrl}/${url}/${params}`);
  // }

  // updateData(url: string, payload: any, params?: string) {
  //   let finalUrl
  //   if(params) {
  //     finalUrl = `${environment.baseUrl}/${url}/${params}`;
  //   } else {
  //     finalUrl = `${environment.baseUrl}/${url}`;
  //   }

  //   if(url === 'camera/updateCameraData_1_0') {
  //     payload.videoServerName = payload.httpUrl;
  //   }
  //   return this.http.put(finalUrl, payload);
  // }

  public set(name: any, data: any) {
    // let x = btoa(encodeURIComponent(JSON.stringify(data)));
    // localStorage.setItem(name, x);
    localStorage.setItem(name, JSON.stringify(data));
  }

  public get(data: any) {
    // let x: any = localStorage.getItem(data);
    // return JSON.parse(decodeURIComponent(atob(x)));
    return JSON.parse(localStorage.getItem(data)!);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }

  public encrypt(txt: string): string {
    return CryptoJS.AES.encrypt(txt, this.key).toString();
  }

  public decrypt(txtToDecrypt: string) {
    return CryptoJS.AES.decrypt(txtToDecrypt, this.key).toString(CryptoJS.enc.Utf8);
  }


  /** admin control */
  public isAdmin(): boolean {
    const user = this.get('user');
    if(!user) return false;
    const list: Array<any> = Array.from(user.roleList, (item: any) => item.category);
    return list.includes('Admin') ? true : false;
  }

  public isSuperAdmin(): boolean {
    const user = this.get('user');
    if(!user) return false;
    const list: Array<any> = Array.from(user.roleList, (item: any) => item.category);
    return list.includes('SuperAdmin') ? true : false;
  }

  public getDepartment(): string | null {
    const user = this.get('user');
    return user.roleList[0].department ?? null;
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private http: HttpClient) { }

   basicurl = `http://192.168.0.109:1234`;

   createDepartments(payload:any){

     let url = `${this.basicurl}/createDepartments_1_0`;
      return this.http.post(url, payload)
   }

    createRoles(payload:any){

     let url = `${this.basicurl}/createRoles_1_0`;
      return this.http.post(url, payload)
   }

   getDepartments(){
     let url = `${this.basicurl}/getDepartments_1_0`;
      return this.http.get(url)
   }
   getRoles(){
     let url = `${this.basicurl}/getRoles_1_0`;
      return this.http.get(url)
   }

   deleteDepartment(payload:any){
    let url = `${this.basicurl}/deleteDepartment_1_0/${payload?.id}`;
    
   
    return this.http.delete(url)
   }

   deleteRoles(payload:any){

    let url = `${this.basicurl}/deleteRole_1_0/${payload?.id}`;
  
    return this.http.delete(url);
   }

   editDepartment(payload:any){
    let url = `${this.basicurl}/updateDepartment_1_0/${payload?.id}`;
  
    return this.http.put(url,payload);
   }
   editRole(payload:any){

    let url = `${this.basicurl}/updateRoles_1_0/${payload?.id}`;
  
    return this.http.put(url,payload);

   }
}

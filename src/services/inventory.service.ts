import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  // baseUrl = `${environment.adsAndInventoryUrl}/inventoryAndtickets`;

  constructor(private http: HttpClient, public datepipe: DatePipe, private storageSer: StorageService) { }

  comment$: any = new BehaviorSubject(null);

  /* inventory */
  listItemCode(payload: any) {
    let url = environment.inventoryUrl + '/listItemCode_1_0';
    let params = new HttpParams();
    if(payload.partType) {
      params = params.set('p_part_type', payload.partType)
    }
    if(payload.partCategory) {
      params = params.set('p_part_category', payload.partCategory)
    }
    if(payload.partCode) {
      params = params.set('p_part_code', payload.partCode)
    }
    if(payload.buildType) {
      params = params.set('p_build_type', payload.buildType)
    }

    return this.http.get(url, {params: params})
  }

  listBrandAndModel(payload: any) {
    let url = environment.inventoryUrl + '/listBrandAndModel_1_0';
    let params = new HttpParams().set('p_item_code', payload.itemCode).set('p_brand', payload.brand);

    // if(payload.itemCode) {
    //   params = params.set('p_item_code', payload.itemCode)
    // }
    // if(payload.brand) {
    //   params = params.set('p_brand', payload.brand)
    // }

    return this.http.get(url, {params: params})
  }


  listInventory() {
    let url = environment.inventoryUrl + `/listInventory_1_0`;
    let params = new HttpParams().set('startDate', '2023-08-05').set('end1_date', formatDate(new Date(), 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url, {params: params});
  }

  listInventoryByProductId(productId: any) {
    let url = environment.inventoryUrl + `/listInventoryByProductId_1_0?productId=${productId}`;
    return this.http.get(url);
  }

  listDetails(payload: any) {
    let url = environment.inventoryUrl + `/listDetails12`;
    let params = new HttpParams().set('t_item_code', payload.itemCode).set('status_id', 4);
    return this.http.get(url, {params: params});
  }

  listDetailsByStatus(payload: any) {
    let url = environment.inventoryUrl + `/listDetails12`;
    let params = new HttpParams().set('status_id', payload);
    return this.http.get(url, {params: params});
  }

  createInventory(payload: any, condition: any) {
    let url = environment.inventoryUrl + '/createInventoryAndWarranty_1_0';
    let payload1;
    let payload2;
    let payload3;
    let payload4;

    if(condition == 'Y') {
      payload1 = payload?.inventory,
      payload2 = payload?.serialnos,
      payload3 = payload?.quantity,
      payload4 = payload?.warranty
    } else {
      payload1 = payload?.inventory,
      payload2 = payload?.serialnos,
      payload3 = payload?.quantity
    }
    const requestBody = {
      'inventory': payload1,
      'serialnos': payload2,
      'quantity': payload3,
      'warranty': payload4
    };

    return this.http.post(url, requestBody)
  }

  updateInventory(payload: any) {
    let url = environment.inventoryUrl + '/updateInventory_1_0';
    return this.http.put(url, payload)
  }

  deleteInventory(payload: any) {
    let url = environment.inventoryUrl + `/deleteInventory_1_0/${payload.id}/${1}`;

    return this.http.delete(url);
  }

  filterInventory(payload: any) {
    let url = environment.inventoryUrl + `/listInventory_1_0`;

    let params = new HttpParams().set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us')).set('end1_date', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us'));
    return this.http.get(url, {params: params});
  }


  /* warrenty service */
  getWarranty(id: any) {
    let url = environment.inventoryUrl + `/listWarranty_1_0/${id}`;
    return this.http.get(url);
  }

  updateWarranty(payload: any) {
    let url = environment.inventoryUrl + '/updateWarranty_1_0';
    return this.http.put(url, payload)
  }

  deleteWarranty(payload: any) {
    let url = environment.inventoryUrl + `/deleteWarranty_1_0/${payload.id}/${1}`;

    return this.http.delete(url);
  }

  updateInventoryStatus(payload: any) {
    let url = environment.inventoryUrl + "/updateInventoryStatus_1_0";
    let params = new HttpParams();
    if (payload.slNo) {
      params = params.set('slNo', payload.slNo);
    }
    if (payload.statusId) {
      params = params.set('statusId', payload.statusId);
    }
    if (payload) {
      params = params.set('modifiedBy', 1);
    }

    return this.http.put(url, null, {params: params});
  }

  listInventoryByItemCode(payload: any) {
    let url = environment.inventoryUrl + "/listInventoryByItemCode_1_0";
    let params = new HttpParams().set('itemCode', payload.itemCode ? payload.itemCode : payload.suggestedItemCode);
    // if(payload.itemCode) {
    //   params = params.set('itemCode', payload.itemCode);
    // }
    if(payload.brand) {
      params = params.set('brand', payload.brand);
    }
    if(payload.model) {
      params = params.set('model', payload.model);
    }

    return this.http.get(url, {params: params});
  }

  getItemCode(payload: any) {
    let url = environment.inventoryUrl + "/getItemCode_1_0";
    let params = new HttpParams().set('name', payload?.materialDescription ?(payload?.materialDescription) : payload);

    return this.http.get(url, {params: params});
  }


  /* product-master */
  listProduct() {
    let url = environment.inventoryUrl + "/listProducts_1_0";
    return this.http.get(url);
  }

  addingproduct(payload: any) {
    let url = environment.inventoryUrl + '/createProduct_1_0';
    return this.http.post(url, payload)
  }

  updateProductMaster(payload: any) {
    let url = environment.inventoryUrl + '/updateProduct_1_0';
    return this.http.put(url, payload)
  }

  deleteProduct(payload: any) {
    let url = environment.inventoryUrl + `/deleteProduct_1_0/${payload.id}/${1}`;
    return this.http.delete(url);
  }

  listByVendor() {
    let url = environment.inventoryUrl + "/listProduct_1_0";
    return this.http.get(url);
  }


  filterProductMaster(payload: any) {
    let url = environment.inventoryUrl + `/listProduct_1_0`;
    let params = new HttpParams();
    if (payload.categoryId) {
      params = params.set('categoryId', payload.categoryId);
    }
    if (payload.typeId) {
      params = params.set('typeId', payload.typeId);
    }
    if (payload.statusId) {
      params = params.set('statusId', payload.statusId);
    }
    if (payload.startDate) {
      params = params.set('startDate', payload.startDate);
    }
    if (payload.endDate) {
      params = params.set('endDate', payload.endDate);
    }
    if (payload.vendorId) {
      params = params.set('vendorId', payload.vendorId);
    }

    return this.http.get(url, {params: params});
  }


  /* indents */
  listIndent() {
    let url = environment.inventoryUrl + "/listIndents_1_0";
    return this.http.get(url);
  }

  listIndentItems(payload: any) {
    let url = environment.inventoryUrl + "/listIndentItems_1_0";
    let params = new HttpParams().set('ticketId', payload?.ticketId);

    // if (payload.ticketId) {
    //   params = params.set('ticketId', payload.id);
    // }

    return this.http.get(url, {params: params});
  }

  listIndentItems1(payload: any) {
    let url = environment.inventoryUrl + `/listIndentItems_1_0`;
    let params = new HttpParams().set('ticketId', payload?.ticketId).set('status', 4);

    return this.http.get(url, {params: params});
  }

  createIndent(payload: any) {
    let url = environment.inventoryUrl + '/createIndent_1_0';
    return this.http.post(url, payload)
  }

  addComponent(payload: any) {
    let url = environment.inventoryUrl + '/addComponent_1_0';
    return this.http.post(url, payload)
  }

  updateIndentStatus(payload1: any, payload2?: any){
    let url = environment.inventoryUrl + `/updateIndentStatus_1_0/${payload1.id}/${payload2.statusId}/${payload2.createdBy}/${payload2.inventoryId}`;
    return this.http.put(url, null);
  }

  updateIndentStatus1(currentId: any, payload: any){
    let url = environment.inventoryUrl + `/updateIndentStatus_1_0/${currentId.id}/${payload.statusId}/${payload.createdBy}`;
    return this.http.put(url, null);
  }

  deleteIndent(payload: any) {
    let url = environment.inventoryUrl + `/deleteIndent_1_0/${payload.id}`;
    return this.http.delete(url);
  }

  replaceComponent(payload: any) {
    let url = environment.inventoryUrl + `/replaceComponent_1_0`;
    let params = new HttpParams();
    if(payload?.oldInventoryId) {
      params = params.set('oldInventoryId', payload?.oldInventoryId);
    }
    if(payload?.newInventoryId) {
      params = params.set('newInventoryId', payload?.newInventoryId);
    }
    if(payload?.replacedBy) {
      params = params.set('replacedBy', payload?.replacedBy);
    }
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId);
    }

    return this.http.put(url, null, {params: params});
  }

  filterIndent(payload: any) {
    let url = environment.inventoryUrl + `/listIndent_1_0`;
    return this.http.get(url, {params: payload});
  }


  /* ticket sevice */
  listTickets() {
    let url = environment.inventoryUrl + "/listTickets_1_0";
    return this.http.get(url);
  }

  createTicket(payload: any) {
    let url = environment.inventoryUrl + '/createTicket_1_0';
    return this.http.post(url, payload);
  }

  createTask(payload: any) {
    let url = environment.inventoryUrl + '/createTask_1_0';
    return this.http.post(url, payload);
  }

  updateTicket(payload: any) {
    let url = environment.inventoryUrl + '/updateTicket_1_0';
    return this.http.put(url, payload);
  }

  deleteTicket(payload: any) {
    let url = environment.inventoryUrl + `/DeleteTicket?ticketId=${payload.ticketId}`;
    return this.http.delete(url);
  }

  listFRTickets(frId: any) {
    let url = environment.inventoryUrl + `/listFRTickets_1_0/${frId}`;
    return this.http.get(url);
  }

  getTasks(ticketId: any) {
    let url = environment.inventoryUrl + `/listTasks_1_0/${ticketId}`;
    return this.http.get(url);
  }

  getTicketVisits(siteId: any) {
    let url = environment.inventoryUrl + `/listFieldVisits_1_0/${siteId}`;
    // let myObj = {
    //   'ticketId': ticketId,
    // }
    return this.http.get(url);
  }

  assignTicket(payload: any) {
    let url = environment.inventoryUrl + '/assignTicket_1_0';
    return this.http.put(url, payload);
  }

  updateTask(payload: any) {
    let url = environment.inventoryUrl + '/updateTask_1_0';
    return this.http.put(url, payload);
  }

  filterTicket(payload: any) {
    let url = environment.inventoryUrl + `/listTickets_1_0`;
    let params = new HttpParams();
    if(payload.siteId) {
      params = params.set('siteId', payload.siteId);
    }
    if(payload.typeId) {
      params = params.set('typeId', payload.typeId);
    }
    if(payload.ticketStatus) {
      params = params.set('ticketStatus', payload.ticketStatus);
    }
    if(payload.startDate) {
      params = params.set('startDate', formatDate(payload.startDate, 'yyyy-MM-dd', 'en-us'));
    }
    if(payload.endDate) {
      params = params.set('endDate', formatDate(payload.endDate, 'yyyy-MM-dd', 'en-us'));
    }

    return this.http.get(url, {params: params});
  }


  getcomments(ticketId: any) {
    let url = environment.inventoryUrl + "/getComments_1_0";
    let myObj = {
      'ticketId': ticketId,
    }
    return this.http.get(url, {params: myObj});
  }

  createComment(payload: any) {
    let url = environment.inventoryUrl + '/createComment_1_0';
    return this.http.post(url, payload);
  }


  /* ticket reorts */
  getTicketsReport() {
    let url = environment.inventoryUrl + `/getTicketsReport_1_0`;
    return this.http.get(url);
  }

  getItemsList(payload: any) {
    let url = environment.inventoryUrl + `/getItemsList_1_0`;
    let params = new HttpParams().set('siteId', payload?.siteId);
    return this.http.get(url, {params: params});
  }

  createFRKit(payload:any){
    let url = environment.inventoryUrl + `/createFRKit_1_0`;
    return this.http.post(url, payload);
  }

  listFRCount() {
    let url = environment.inventoryUrl + `/listFRCount_1_0`;
    return this.http.get(url);
  }

  getItemCodes(slNo: any) {
    let url = environment.inventoryUrl + `/getItemCodes_1_0`;
    let params = new HttpParams().set('slNo', slNo)
    return this.http.get(url, {params: params});
  }

  listInventoryByItemCode_1_0(itemCode: any) {
    let url = environment.inventoryUrl + `/listInventoryByItemCode_1_0`;
    let params = new HttpParams().set('itemCode', itemCode)
    return this.http.get(url, {params: params});
  }



  /* fr services */
  listFRSites(frId: any) {
    let url = environment.inventoryUrl + `/listFRSites_1_0/${frId}`;
    return this.http.get(url);
  }

  listFRItems(frId: any, statusId: any) {
    let url = environment.inventoryUrl + `/listFRItems_1_0`;
    let params = new HttpParams()
    if(frId) {
      params = params.set('frId', frId)
    }
    if(statusId){
      params = params.set('statusId', statusId)
    }
    return this.http.get(url, {params: params});
  }

  fieldVisitEntry(payload: any) {
    let user: any = this.storageSer.get('user');
    let url = environment.inventoryUrl + `/fieldVisitEntry_1_0`;
    let myObj = {
      'frId': user?.UserId,
      'siteId': payload?.siteId,
      'ticketId': payload?.ticketId
    }

    return this.http.post(url, myObj);
  }

  listFRTasksOfCurrentVisit(frId: any, siteId:any) {
    let url = environment.inventoryUrl + `/listFRTasksOfCurrentVisit_1_0/${frId}/${siteId}`;
    return this.http.get(url);
  }

  logTaskStatus(payload: any) {
    let url = environment.inventoryUrl + `/logTaskStatus_1_0`;
    return this.http.post(url, payload);
  }

  fieldVisitExit(payload: any) {
    let url = environment.inventoryUrl + `/fieldVisitExit_1_0`;
    return this.http.put(url, payload);
  }

  updateDispatchToInventory(payload:any) {
    let url = environment.inventoryUrl + `/updateDispatchToInventory_1_0`;
    return this.http.post(url, payload);
  }


  /* fr-reports */
  listFRReports(payload:any) {
    let url = environment.inventoryUrl + "/listFRReports_1_0";
    let params = new HttpParams();
    if(payload?.p_frId) {
      params = params.set('p_frId', payload?.p_frId)
    }
    if(payload?.p_startdate) {
      params = params.set('p_startdate', formatDate(payload?.p_startdate, 'yyyy-MM-dd', 'en-us'))
    }
    if(payload?.p_enddate) {
      params = params.set('p_enddate', formatDate(payload?.p_enddate, 'yyyy-MM-dd', 'en-us'))
    }
    return this.http.get(url, {params:params});
  }

  listDC() {
    let url = environment.inventoryUrl + `/listDC_2_0`;
    return this.http.get(url);
  }

  getlistByCreatedBy(payload: any) {
    let url = environment.inventoryUrl + `/getlistByCreatedBy_1_0`;
    let params = new HttpParams()
    if(payload.createdBy) {
      params = params.set('createdBy',payload.createdBy)
    }
    if(payload.dateOfChallan) {
      params = params.set('dateOfChallan', formatDate(payload.dateOfChallan, 'yyyy-MM-dd', 'en-us'))
    }
    return this.http.get(url, {params: params});
  }


  /* dc challan */
  createDC(payload:any) {
    let url = environment.inventoryUrl + '/createDC_1_0';
    return this.http.post(url, payload )
  }

  listDescriptionOfGoodsByDcNumber(payload:any) {
    let url = environment.inventoryUrl + `/listDescriptionOfGoodsByDcNumber_1_0`;
    let params = new HttpParams().set('dcNumber', payload.dcNumber)
      return this.http.get(url, {params:params});
  }

  updateDC(payload:any) {
    let url = environment.inventoryUrl + `/updateDC_2_0`;
    let params = new HttpParams().set('dcNumber', payload?.dcNumber).set('amount',payload?.amount).set('receiptNo', payload?.receiptNo).set('modifiedBy', payload?.modifiedBy)
    return this.http.put(url, null, {params:params})
  }

  listQuantity(payload:any) {
    let url = environment.inventoryUrl + `/listQuantity_1_0`;
    let params = new HttpParams().set('itemCode', payload?.itemCode).set('statusId', payload?.statusId).set('modifiedBy', payload?.modifiedBy)
      return this.http.get(url, {params:params});
  }

  getAllDC(payload:any) {
    let url = environment.inventoryUrl + '/getAllDC_2_0';
    let params = new HttpParams()
    if(payload?.createdBy) {
      params = params.set('createdBy',payload?.createdBy)
    }
    if(payload?.dateOfChallan) {
      params = params.set('dateOfChallan', formatDate(payload?.dateOfChallan, 'yyyy-MM-dd', 'en-us'))
    }
    if(payload?.state) {
      params = params.set('state', payload?.state)
    }
    return this.http.get(url, {params:params})
  }



  /* orders */
  listOrders() {
    let url = environment.inventoryUrl + "/listOrders_1_0";
    return this.http.get(url);
  }

  createOrder(payload: any) {
    let url = environment.inventoryUrl + '/createOrder_1_0';
    return this.http.post(url, payload)
  }

  updateOrder(payload: any) {
    let url = environment.inventoryUrl + '/updateOrder_1_0';
    let params = new HttpParams().set('id', payload.id).set('invoiceNo', payload.invoiceNo).set('by', payload.by).set('remarks', payload.remarks);
    return this.http.put(url, null, {params: params})
  }

  deleteOrder(payload: any) {
    let url = environment.inventoryUrl + `/deleteOrder_1_0/${payload.id}`;
    return this.http.delete(url);
  }

  filterOrders(payload: any) {
    let url = environment.inventoryUrl + `/listOrders_1_0`;
    return this.http.get(url, {params: payload});
  }


  listOrderItems() {
    let url = environment.inventoryUrl + "/listOrderItems_1_0";
    return this.http.get(url);
  }

  listOrderItemsById(id: any) {
    let url = environment.inventoryUrl + "/listOrderItems_1_0";
    let myObj = {
      'orderId': id
    }
    return this.http.get(url, {params: myObj});
  }

  addItemToOrder(payload: any) {
    let url = environment.inventoryUrl + '/addItemToOrder_1_0';
    return this.http.post(url, payload)
  }

  updateOrderItem(payload: any) {
    let url = environment.inventoryUrl + '/updateOrderItem_1_0';
    let params = new HttpParams().set('id', payload?.id).set('productQuantity', payload?.productQuantity).set('by', payload?.by);
    return this.http.put(url, null, {params: params})
  }

  deleteOrderItem(payload: any) {
    let url = environment.inventoryUrl + `/deleteOrderItem_1_0/${payload?.id}`;
    return this.http.delete(url);
  }


  listVendors() {
    let url = environment.inventoryUrl + '/listVendors_1_0';
    return this.http.get(url)
  }

  listVendorsById(vendorId: any) {
    let url = environment.inventoryUrl + `/listProduct_1_0?vendorId=${1}&statusId=${1}`;
    return this.http.get(url)
  }

  createVendors(payload: any) {
    let url = environment.inventoryUrl + '/createVendor_1_0';
    return this.http.post(url, payload);
  }

  updatevendor(payload: any) {
    let url = environment.inventoryUrl + '/updateVendor_1_0';
    return this.http.put(url, payload);
  }

  deleteVendor(payload: any) {
    let url = environment.inventoryUrl + `/deleteVendor_1_0/${payload.id}/${1}`;
    return this.http.delete(url);
  }


  listSensorData(payload?:any) {
    let url = environment.inventoryUrl + '/listSensorData_1_0';
    let params = new HttpParams();
    if(payload?.siteId) {
      params = params.set('siteId', payload?.siteId)
    }
    if(payload?.deviceId) {
      params = params.set('device_name' ,payload?.deviceId)
    }
    return this.http.get(url,{params:params});
  }

}


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//components
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { AddNewSiteComponent } from './main-dashboard/add-new-site/add-new-site.component';
import { AddNewCameraComponent } from './main-dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './main-dashboard/add-new-customer/add-new-customer.component';
import { AddNewBusinessVerticalComponent } from './main-dashboard/add-new-business-vertical/add-new-business-vertical.component';
import { AddNewUserComponent } from './main-dashboard/add-new-user/add-new-user.component';
import { LoginComponent } from './login/login.component';
import { AddAdditionalSiteComponent } from './main-dashboard/add-additional-site/add-additional-site.component';
import { AddDeviceComponent } from './main-dashboard/add-device/add-device.component';
import { AddNewAssetComponent } from './main-dashboard/add-new-asset/add-new-asset.component';
import { AddNewInventoryComponent } from './main-dashboard/add-new-inventory/add-new-inventory.component';
import { AddNewAnalyticComponent } from './main-dashboard/add-new-analytic/add-new-analytic.component';
import { AddNewTicketComponent } from './main-dashboard/add-new-ticket/add-new-ticket.component';
import { AddMetadataComponent } from './main-dashboard/add-metadata/add-metadata.component';
import { DeviceViewComponent } from './main-dashboard/add-device/device-view/device-view.component';
import { AddProductMasterComponent } from './main-dashboard/add-product-master/add-product-master.component';
import { AddNewVendorComponent } from './main-dashboard/add-new-vendor/add-new-vendor.component';
import { AddNewOrderComponent } from './main-dashboard/add-new-order/add-new-order.component';
import { AddNewIndentComponent } from './main-dashboard/add-new-indent/add-new-indent.component';
import { AddNewFrkitComponent } from './main-dashboard/add-new-frkit/add-new-frkit.component';
import { LoginLoaderComponent } from './utilities/loader/login-loader.component';
import { AddNewDcComponent } from './main-dashboard/add-new-dc/add-new-dc.component';
import { AddNewEventComponent } from './main-dashboard/add-new-event/add-new-event.component';



//utilities
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { LoaderComponent } from './utilities/loader/loader.component';
import { DatePipe } from '@angular/common';
import { SearchPipe } from './utilities/pipes/search.pipe';
import { SortPipe } from './utilities/pipes/sort.pipe';
import { ErrorPageComponent } from './utilities/error-page/error-page.component';
import { DcChallanComponent } from './components/dc-challan/dc-challan.component';
import { RemoveDuplicatesPipe } from './utilities/pipes/remove-duplicates.pipe';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { AdvertisementsComponent } from './components/advertisements/advertisements.component';
import { FrKitComponent } from './components/fr-kit/fr-kit.component';
import { AdInfoComponent } from './components/advertisements/ad-info/ad-info.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DevicesComponent } from './components/devices/devices.component';
import { FrReportsComponent } from './components/fr-reports/fr-reports.component';
import { FrComponent } from './components/fr/fr.component';
import { IndentsComponent } from './components/indents/indents.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MetaDataComponent } from './components/meta-data/meta-data.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductMasterComponent } from './components/product-master/product-master.component';
import { QRAdsComponent } from './components/qr-ads/qr-ads.component';
import { SitesComponent } from './components/sites/sites.component';
import { TicketReportsComponent } from './components/ticket-reports/ticket-reports.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { UsersComponent } from './components/users/users.component';
import { VendorsComponent } from './components/vendors/vendors.component';
import { VerticalsComponent } from './components/verticals/verticals.component';
import { WifiAdsComponent } from './components/wifi-ads/wifi-ads.component';
import { WifiAnalyticsComponent } from './components/wifi-analytics/wifi-analytics.component';
import { DeviceInfoComponent } from './components/devices/device-info/device-info.component';
import { WifiDetailComponent } from './components/wifi-analytics/wifi-detail/wifi-detail.component';
import { MaterialModule } from './material.module';
import { FilterComponent } from './utilities/filter/filter.component';
import { TextAndNumberOnlyDirective } from './utilities/directives/text-and-number-only.directive';
import { AddNewInstallationComponent } from './main-dashboard/add-new-installation/add-new-installation.component';
import { AddDeviceFormComponent } from './main-dashboard/add-device-form/add-device-form.component';
import { EditDeviceFormComponent } from './main-dashboard/edit-device-form/edit-device-form.component';
import { SensorDataComponent } from './components/sensor-data/sensor-data.component';
import { CamerasComponent } from './components/cameras/cameras.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DefenderComponent } from './components/defender/defender.component';
import { AddDefenderCamComponent } from './main-dashboard/add-defender-cam/add-defender-cam.component';
import { AddDefenderRouterComponent } from './main-dashboard/add-defender-router/add-defender-router.component';
import { NewDeviceComponent } from './components/new-device/new-device.component';
import { AddSecondDeviceComponent } from './main-dashboard/add-second-device/add-second-device.component';
import { NewAdvertisementComponent } from './components/new-advertisement/new-advertisement.component';
import { AddNewAdvertisementComponent } from './main-dashboard/add-new-advertisement/add-new-advertisement.component';
import { AddNewRuleComponent } from './main-dashboard/add-new-rule/add-new-rule.component';
import { AddNewDeviceComponent } from './main-dashboard/add-new-device/add-new-device.component';
import { GeneralComponent } from './components/general/general.component';
import { MailComponent } from './mail/mail.component';
import { EditFormComponent } from './utilities/edit-form/edit-form.component';
import { EditCameraComponent } from './components/cameras/edit-camera/edit-camera.component';
import { OrderByPipe } from './utilities/pipes/order-by.pipe';
import { CountPipe } from './utilities/pipes/count.pipe';
import { DeviceStatusComponent } from './device-status/device-status.component';
import { CreateFormComponent } from './utilities/create-form/create-form.component';
import { FaqComponent } from './components/faq/faq.component';
import { CreateFaqComponent } from './main-dashboard/create-faq/create-faq.component';
import { CreateSensorDeviceComponent } from './main-dashboard/create-sensor-device/create-sensor-device.component';
import { CreateZoneComponent } from './main-dashboard/create-zone/create-zone.component';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { TableComponent } from './utilities/table/table.component';
import { TokenInterceptor } from './utilities/token.interceptor';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CountryStateCityComponent } from './utilities/country-state-city/country-state-city.component';
import { ConfigurationComponent } from 'src/app/components/configuration/configuration.component';
import { ImagePipe } from './utilities/pipes/image.pipe';
import { SanitizePipe } from './utilities/pipes/sanitize.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { CameraTransferComponent } from './camera-transfer/camera-transfer.component';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MainDashboardComponent,
    AddNewSiteComponent,
    AddNewCameraComponent,
    AddNewCustomerComponent,
    AddNewBusinessVerticalComponent,
    AddNewUserComponent,
    SitesComponent,
    CustomersComponent,
    LoaderComponent,
    LoginLoaderComponent,
    LoginComponent,
    UsersComponent,
    AddAdditionalSiteComponent,
    TicketsComponent,
    InventoryComponent,
    AddDeviceComponent,
    AddNewAssetComponent,
    VerticalsComponent,
    AnalyticsComponent,
    AddNewInventoryComponent,
    AddNewAnalyticComponent,
    AddNewTicketComponent,
    AdInfoComponent,
    MetaDataComponent,
    AddMetadataComponent,
    DeviceViewComponent,
    DevicesComponent,
    ProductMasterComponent,
    AddProductMasterComponent,
    QRAdsComponent,
    WifiAdsComponent,
    VendorsComponent,
    AddNewVendorComponent,
    AddNewDeviceComponent,
    OrdersComponent,
    AddNewOrderComponent,
    IndentsComponent,
    AddNewIndentComponent,
    FrComponent,
    TicketReportsComponent,
    AdvertisementsComponent,
    FrKitComponent,
    AddNewFrkitComponent,
    FrReportsComponent,
    AddNewDcComponent,
    AddNewInstallationComponent,
    AddDeviceFormComponent,
    EditDeviceFormComponent,
    SearchPipe,
    SortPipe,
    ErrorPageComponent,
    DcChallanComponent,
    RemoveDuplicatesPipe,
    WifiAnalyticsComponent,
    DeviceInfoComponent,
    WifiDetailComponent,
    FilterComponent,
    TextAndNumberOnlyDirective,
    SensorDataComponent,
    CamerasComponent,
    DefenderComponent,
    AddDefenderCamComponent,
    AddDefenderRouterComponent,
    AddSecondDeviceComponent,
    NewAdvertisementComponent,
    AddNewAdvertisementComponent,
    AddNewRuleComponent,
    EditCameraComponent,
    NewDeviceComponent,
    GeneralComponent,
    DeviceStatusComponent,
    MailComponent,
    CreateFormComponent,
    EditFormComponent,
    OrderByPipe,
    CountPipe,
    FaqComponent,
    CreateFaqComponent,
    CreateSensorDeviceComponent,
    CreateZoneComponent,
    AddNewEventComponent,
    TableComponent,
    AdminPanelComponent,
    CountryStateCityComponent,
    ConfigurationComponent,
    ImagePipe,
    SanitizePipe,
    PaginationComponent,
    CameraTransferComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatDatepickerModule,
    NgCircleProgressModule,

     // Specify ng-circle-progress as an import
     NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 6,
      innerStrokeWidth: 2,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ],
  providers: [
    DatePipe,
    DevicesComponent,
    AddDeviceComponent,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

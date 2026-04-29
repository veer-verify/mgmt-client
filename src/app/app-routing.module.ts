import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './utilities/auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { ErrorPageComponent } from './utilities/error-page/error-page.component';
import { AdvertisementsComponent } from './components/advertisements/advertisements.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { CamerasComponent } from './components/cameras/cameras.component';
import { CustomersComponent } from './components/customers/customers.component';
import { DefenderComponent } from './components/defender/defender.component';
import { DevicesComponent } from './components/devices/devices.component';
import { FrKitComponent } from './components/fr-kit/fr-kit.component';
import { FrReportsComponent } from './components/fr-reports/fr-reports.component';
import { FrComponent } from './components/fr/fr.component';
import { GeneralComponent } from './components/general/general.component';
import { IndentsComponent } from './components/indents/indents.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { MetaDataComponent } from './components/meta-data/meta-data.component';
import { NewAdvertisementComponent } from './components/new-advertisement/new-advertisement.component';
import { NewDeviceComponent } from './components/new-device/new-device.component';
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
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddNewBusinessVerticalComponent } from './main-dashboard/add-new-business-vertical/add-new-business-vertical.component';
import { AddNewCameraComponent } from './main-dashboard/add-new-camera/add-new-camera.component';
import { AddNewCustomerComponent } from './main-dashboard/add-new-customer/add-new-customer.component';
import { AddNewSiteComponent } from './main-dashboard/add-new-site/add-new-site.component';
import { AddNewUserComponent } from './main-dashboard/add-new-user/add-new-user.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { SensorDataComponent } from './components/sensor-data/sensor-data.component';
import { DeviceStatusComponent } from './device-status/device-status.component';
import { FaqComponent } from './components/faq/faq.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { ConfigurationComponent } from 'src/app/components/configuration/configuration.component';
import { AuditReportComponent } from './components/audit-report/audit-report.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'main-dashboard', loadComponent: () => import('./main-dashboard/main-dashboard.component').then((c) => c.MainDashboardComponent) },
      { path: 'verticals', component: VerticalsComponent },
      { path: 'add-new-site', component: AddNewSiteComponent },
      { path: 'add-new-camera', component: AddNewCameraComponent },
      { path: 'add-new-customer', component: AddNewCustomerComponent },
      { path: 'add-new-user', component: AddNewUserComponent },
      { path: 'add-new-business', component: AddNewBusinessVerticalComponent },
      { path: 'sites', loadComponent: () => import('./components/sites/sites.component').then((c) => c.SitesComponent) },
      { path: 'devices', component: DevicesComponent },
      { path: 'device-status', component: DeviceStatusComponent },
      { path: 'analytics', component: AnalyticsComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'users', component: UsersComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'product-master', component: ProductMasterComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'indents', component: IndentsComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'ticket-reports', component: TicketReportsComponent },
      { path: 'audit-report', component: AuditReportComponent },
      { path: 'fr', component: FrComponent },
      { path: 'advertisements', component: AdvertisementsComponent },
      { path: 'meta', component: MetaDataComponent },
      { path: 'vendors', component: VendorsComponent },
      { path: 'fr-reports', component: FrReportsComponent },
      { path: 'qr-ads', component: QRAdsComponent },
      { path: 'wifi-ads', component: WifiAdsComponent },
      { path: 'fr-kit', component: FrKitComponent },
      { path: 'wifi-analytics', component: WifiAnalyticsComponent },
      { path: 'sensor-data', component: SensorDataComponent },
      { path: 'cameras', component: CamerasComponent },
      { path: 'defender', component: DefenderComponent },
      { path: 'new-device', component: NewDeviceComponent },
      { path: 'new-adver', component: NewAdvertisementComponent },
      { path: 'general', component: GeneralComponent },
      { path: 'Faqs', component: FaqComponent },
      { path: 'admin-panel', component: AdminPanelComponent },
      { path: 'config', component: ConfigurationComponent }
    ],
  },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule { }

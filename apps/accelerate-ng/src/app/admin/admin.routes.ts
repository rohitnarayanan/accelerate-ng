// external imports
import { Route, Routes } from '@angular/router';
import { Temp } from './temp/temp';

// internal imports

// admin routes
export const AdminRoutes: Routes = [
  // { path: 'dashboard/messages/corporate', component: dashboard.MessageComponent, data: { messageType: 'corporate', permission: 'ew.loop.dashboard.message.corporate' } },
  // { path: 'dashboard/messages/store', component: dashboard.MessageComponent, data: { messageType: 'store', permission: 'ew.loop.dashboard.message.store' } },
  // { path: 'dashboard/images', component: dashboard.ImageComponent, data: { permission: 'ew.loop.dashboard.image' } },
  // // { path: 'dashboard/performance', component: dashboard.ImageComponent, data: { permission: 'ew.loop.dashboard.performance' } },

  // { path: 'sales/activations', component: sales.TxnActivationComponent, data: { permission: 'ew.loop.sales.activation' } },
  // { path: 'sales/accessories', component: sales.TxnAccessoryComponent, data: { permission: 'ew.loop.sales.accessory' } },
  // { path: 'sales/shoppertrak', component: sales.ShoppertrakComponent, data: { permission: 'ew.loop.shoppertrak.traffic.daily' } },

  // { path: 'data/roles', component: masterdata.RoleComponent, data: { permission: 'ew.loop.core.role' } },
  // { path: 'data/employees', component: masterdata.EmployeeComponent, data: { permission: 'ew.loop.core.employee' } },
  // // { path: 'data/employee-locations', component: masterdata.EmployeeComponent, data: { permission: 'ew.loop.core.employee.locations' } },
  // { path: 'data/regions', component: masterdata.RegionComponent, data: { permission: 'ew.loop.core.region' } },
  // { path: 'data/markets', component: masterdata.MarketComponent, data: { permission: 'ew.loop.core.market' } },
  // { path: 'data/stores', component: masterdata.StoreComponent, data: { permission: 'ew.loop.core.store' } },
  // { path: 'data/plans', component: masterdata.PlanComponent, data: { permission: 'ew.loop.core.plan' } },
  // { path: 'data/accessories', component: masterdata.AccessoryComponent, data: { permission: 'ew.loop.core.accessory' } },
  { path: '**', component: Temp },
] satisfies Route[];

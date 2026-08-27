import authModule from './auth';
import dashboardModule from './dashboard';
import homeModule from './home';
import toastModule from './toast';

export const featureModules = [homeModule, authModule, dashboardModule, toastModule];

export const featureReducers = Object.fromEntries(featureModules.filter((module) => module.reducer).map((module) => [module.name, module.reducer]));

export const routesForLayout = (layout) =>
  featureModules.flatMap((module) => (module.routes ?? []).filter((route) => route.layout === layout).map(({ layout: _layout, ...route }) => route));

import adminModule from './admin';
import analyticsModule from './analytics';
import authModule from './auth';
import dashboardModule from './dashboard';
import documentsModule from './documents';
import entitiesModule from './entities';
import exportsModule from './exports';
import homeModule from './home';
import profileModule from './profile';
import qaModule from './qa';
import summariesModule from './summaries';
import toastModule from './toast';
import toolsModule from './tools';

export const featureModules = [
  homeModule,
  toolsModule,
  authModule,
  adminModule,
  dashboardModule,
  profileModule,
  documentsModule,
  summariesModule,
  qaModule,
  entitiesModule,
  analyticsModule,
  exportsModule,
  toastModule,
];


export const featureReducers = Object.fromEntries(featureModules.filter((module) => module.reducer).map((module) => [module.name, module.reducer]));

const documentStages = featureModules.flatMap((module) => module.documentStages ?? []);

export const routesForLayout = (layout) =>
  featureModules.flatMap((module) =>
    (module.routes ?? [])
      .filter((route) => route.layout === layout)
      .map(({ layout: _layout, withDocumentStages, children, ...route }) =>
        withDocumentStages ? { ...route, children: [...(children ?? []), ...documentStages] } : { ...route, ...(children ? { children } : {}) },
      ),
  );

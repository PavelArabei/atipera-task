import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import(
      './periodicTableFeature/pages/tablePage/tablePage.component'
    ).then((m) => m.TablePageComponent),
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './periodicTableFeature/pages/table-page/table-page.component'
      ).then((m) => m.TablePageComponent),
  },
];

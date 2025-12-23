import { Routes } from '@angular/router';
import { StructureListComponent } from './features/structures/structure-list.component/structure-list.component';
import { StructureDetailComponent } from './features/structures/structure-detail.component/structure-detail.component';
import { FeatureListComponent } from './features/feature-list.component/feature-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'structures', pathMatch: 'full' },
  { path: 'structures', component: StructureListComponent },
  { path: 'structure/:id', component: StructureDetailComponent },
  { path: 'features', component: FeatureListComponent },
  { path: '**', redirectTo: 'structures' }
];
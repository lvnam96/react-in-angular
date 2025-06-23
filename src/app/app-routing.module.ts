import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactSelectComponent } from 'src/react-app/react-select/react-select.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: ReactSelectComponent,
  },
  {
    path: 'another',
    component: ReactSelectComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

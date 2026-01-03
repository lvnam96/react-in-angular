import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactSelectComponent } from 'src/react-app/custom-components/react-select.component';

// Demonstration of routing to a component that uses a React Select component (third party library): it should not load the React Select code until this route is activated & should not load twice if navigating away and back (`/dashboard` to `/` then `/dashboard` again) or to another route that loads the same component (`/dashboard` then `/another`).
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

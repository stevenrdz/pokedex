import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetallePokemonPage } from './detalle-pokemon.page';

const routes: Routes = [
  {
    path: '',
    component: DetallePokemonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetallePokemonPageRoutingModule {}

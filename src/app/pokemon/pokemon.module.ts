import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PokemonComponent } from './pokemon.component';
import { BusquedaPipe } from '../pipe/busqueda.pipe';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule, ReactiveFormsModule],
  declarations: [PokemonComponent, BusquedaPipe],
  exports: [PokemonComponent]
})
export class PokemonComponentModule {}

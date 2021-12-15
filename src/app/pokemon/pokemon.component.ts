import { Component, OnInit, ViewChild } from '@angular/core';
import { PokedexService } from '../services/pokedex.service';
import { PokemonEntry } from '../interfaces/pokemon.interface';
import { Pokemon } from '../interfaces/poder-solar.interface';

import { ModalController } from '@ionic/angular';
import { DetallePokemonPage } from '../detalle-pokemon/detalle-pokemon.page';
import { Ability } from '../interfaces/habilidad-pokemon.interface';

import { IonInfiniteScroll } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
})
export class PokemonComponent{

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  filtrarPokemon: string = '';
  pokemon: PokemonEntry[] = [];
  pokemonSolar: Pokemon[] = [];
  imgIterador: String[] = [];
  flagSolar: Boolean = false;
  habilidadPokemon: Ability[] = [];

  constructor(
    private pokedexService: PokedexService,
    public modalController: ModalController) { this.cargarListado(); }

  cargarListado(){
    const fill = (number, len) =>
    "0".repeat(len - number.toString().length) + number.toString();
    this.pokedexService.listarPokemon().subscribe(
      (resp => {
        if(resp.estado){
          for(let i of resp.datos.pokemon_entries){
            this.imgIterador.push(fill(String(i.entry_number),3));
          }
          this.pokemon = resp.datos.pokemon_entries;
        }else{ console.log("No existen pokemones"); }
      })
    );
  }

  cargarListadoSolar(){
    if(this.flagSolar == false){
      this.flagSolar = true;
      this.pokedexService.poderSolarPokemon().subscribe(
        (resp => {
          if(resp.estado){
            for(let item of resp.data.pokemon){
              this.pokemonSolar.push(item);
              let regex = item.pokemon.url;
              item.pokemon.url = regex.replace(/[https://pokeapi.co/api/v2/pokemon/][\s\S]*?|[/]/g,"");
            }
          }else{  console.log("No existen pokemones"); }
        })
      );
    }
    else{ this.pokemonSolar = [];  this.flagSolar = false; }
  }

  async DetallePokemonModal(item: Number) {
    const modal = await this.modalController.create({
      component: DetallePokemonPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'idPokemonDetalle': item
      }
    });
    return await modal.present();
  }

  /* loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (data.length == 1000) {
        event.target.disabled = true;
      }
    }, 500); 
  }*/
  
}

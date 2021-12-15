import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokedexService } from '../services/pokedex.service';

import { Ability } from '../interfaces/habilidad-pokemon.interface';
import { ModalController } from '@ionic/angular';
import { Detalle, PalParkEncounter } from '../interfaces/detalle-pokemon.interface';

@Component({
  selector: 'app-detalle-pokemon',
  templateUrl: './detalle-pokemon.page.html',
})
export class DetallePokemonPage implements OnInit {

  @Input() idPokemonDetalle: Number;

  nombrePokemon : string = '';
  imgIterador: String;
  descripcionPokemon: String;
  habilidadPokemon: Ability[] = [];
  categoriaPokemon: String = '';
  tipoPokemon: String[] = [];
  detallePokemon: Detalle;
  estadisticaPokemon: PalParkEncounter;
  idPokemon: Number;
  pokemonData: any;

  constructor(
    private pokedexService: PokedexService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.obtenerDetalle();
    this.obtenerHabilidad();
  }

  obtenerDetalle(): void {

    const fill = (number, len) =>
    "0".repeat(len - number.toString().length) + number.toString();
    this.idPokemon = +this.idPokemonDetalle
    this.imgIterador = (fill(String(this.idPokemon),3))

    this.pokedexService.detallePokemon(this.idPokemon).subscribe(
      (resp => {
        if(resp.estado){
          this.detallePokemon = resp.data;
          //obtener detalle pokemon
          for(let item of resp.data.genera){
            if(item.language.name == "es"){
              this.categoriaPokemon = item.genus
            }
          }
          for(let item of resp.data.egg_groups){
            this.tipoPokemon.push(item.name);
          }
          for(let item of resp.data.pal_park_encounters){
            this.estadisticaPokemon = item;
          }
          for(let item of resp.data.varieties){
            this.nombrePokemon = item.pokemon.name
          }
          for(let item of resp.data.flavor_text_entries){
            if(item.language.name=="es" && item.version.name == "x"){
              this.descripcionPokemon = item.flavor_text;
            }
          }
        }else{ console.log("No existe pokemón"); }
      })
    );
  }

  obtenerHabilidad(){
    this.pokedexService.habilidadPokemon(this.idPokemon).subscribe(
      (resp => {
        if(resp.estado){
          for(let item of resp.data.abilities){ this.habilidadPokemon.push(item) }
        }else{ console.log("No existe pokemón"); }
      })
    );
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.pokemonData = {
        nombre: this.nombrePokemon,
        numero: this.imgIterador,
        descripcion: this.descripcionPokemon
      };
    }, 1500);
  }

  dismiss() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

}

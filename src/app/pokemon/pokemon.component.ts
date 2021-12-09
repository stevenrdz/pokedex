import { Component, OnInit, Input } from '@angular/core';
// import { Message } from '../services/data.service';
import { PokedexService } from '../services/pokedex.service';
import { Region, PokemonEntry } from '../interfaces/pokemon.interface';
import { Pokemon, Generation } from '../interfaces/poder-solar.interface';

@Component({
  selector: 'app-pokemon',
  templateUrl: './pokemon.component.html',
  styleUrls: ['./pokemon.component.scss'],
})
export class PokemonComponent implements OnInit {

  pokemon: PokemonEntry[] = [];
  pokemonSolar: Pokemon[] = [];
  imgIterador: String[] = [];
  flagSolar: Boolean = false;
  constructor(private pokedexService: PokedexService) { 
    this.cargarListado();
  }

  ngOnInit() {}

  cargarListado(){

    const fill = (number, len) =>
    "0".repeat(len - number.toString().length) + number.toString();

    this.pokedexService.listarPokemon().subscribe(
      (resp => {
        if(resp.estado){
          for(let i of resp.datos.pokemon_entries){
            this.imgIterador.push(fill(String(i.entry_number),3))
          }
          this.pokemon = resp.datos.pokemon_entries;
        }else{
          console.log("No existen pokemones");
        }
      })
    );
  }

  cargarListadoSolar(){
    
    if(this.flagSolar == false){
      this.flagSolar = true;

      const fill = (number, len) =>
      "0".repeat(len - number.toString().length) + number.toString();

      this.pokedexService.poderSolarPokemon().subscribe(
        (resp => {
          if(resp.estado){
            console.log(resp.data)
            for(let item of resp.data.pokemon){
              this.pokemonSolar.push(item)
            }
            console.log("solares",this.pokemonSolar)
          }else{
            console.log("No existen pokemones");
          }
        })
      );
    }
    else{
      this.flagSolar = false;
      this.pokemonSolar = [];
    }
    
  }

}

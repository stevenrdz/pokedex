import { Pipe, PipeTransform } from '@angular/core';
import { PokemonEntry } from '../interfaces/pokemon.interface';

@Pipe({
  name: 'busqueda'
})
export class BusquedaPipe implements PipeTransform {
  transform(value: PokemonEntry[], arg: string){
    let queryPokemon = [];
    for(let item of value){
      if(item.pokemon_species.name.indexOf(arg) > -1){
        queryPokemon.push(item);
      };
    };
    return queryPokemon;
  }
}

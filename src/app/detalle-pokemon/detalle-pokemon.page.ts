import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokedexService } from '../services/pokedex.service';
import { Variety, Color } from '../interfaces/detalle-pokemon.interface';
import { FlavorTextEntry } from '../interfaces/poder-solar.interface';
import { HabilidadesPokemon, Ability, Species } from '../interfaces/habilidad-pokemon.interface';
import { importType } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-detalle-pokemon',
  templateUrl: './detalle-pokemon.page.html',
})
export class DetallePokemonPage implements OnInit {


  variedadPokemon : string = '';
  imgIterador: String;
  descripcionPokemon: String;
  habilidadPokemon: Ability[] = [];
  idPokemon: Number;

  constructor(
    private route: ActivatedRoute,
    private pokedexService: PokedexService
  ) { }

  ngOnInit() {
    this.obtenerDetalle();
    this.obtenerHabilidad();
  }

  obtenerDetalle(): void {

    const fill = (number, len) =>
    "0".repeat(len - number.toString().length) + number.toString();

    this.idPokemon = +this.route.snapshot.paramMap.get('id');
    this.imgIterador = (fill(String(this.idPokemon),3))

    this.pokedexService.detallePokemon(this.idPokemon).subscribe(
      (resp => {
        if(resp.estado){
          console.log("detalle: ",resp);
          for(let item of resp.data.varieties){
            this.variedadPokemon = item.pokemon.name
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
          for(let item of resp.data.abilities){
            this.habilidadPokemon.push(item)
          }
          
          console.log("Habilidad: ",this.habilidadPokemon);
        }else{ console.log("No existe pokemón"); }
      })
    );
  }

}

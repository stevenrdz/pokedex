import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Pokedex } from '../interfaces/pokemon.interface';
import { DetallePokemon } from '../interfaces/detalle-pokemon.interface';
import { HabilidadesPokemon } from '../interfaces/habilidad-pokemon.interface';
import { PoderSolar } from '../interfaces/poder-solar.interface';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  
  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  listarPokemon(){
    return this.http.get<Pokedex>(`${this.baseUrl}/pokemon`);
  }

  detallePokemon(params: Number){
    return this.http.get<DetallePokemon>(`${this.baseUrl}/pokemon/especie/${params}`);
  }
  habilidadPokemon(params: Number){
    return this.http.get<HabilidadesPokemon>(`${this.baseUrl}/pokemon/habilidades/${params}`);
  }

  poderSolarPokemon(){
    return this.http.get<PoderSolar>(`${this.baseUrl}/pokemon/habilidadSolar`);
  }

}

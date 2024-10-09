import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { CreateTransaccionDto } from '@shared/dto/create-transaccion-dto';
import { TipoTransaccionModel } from '@shared/models/tipo-transaccion-model';
import { TransaccionModel } from '@shared/models/transaccion-model';

const{API_URL} = environment

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  private http = inject(HttpClient);

  url:string = `${API_URL}/transacciones`;

  constructor() { }

  getAll(){
    return this.http.get<TransaccionModel[]>(this.url)
  }

  create(data:CreateTransaccionDto){
    return this.http.
    post<TransaccionModel>(this.url,data);
  }

  delete (id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
}

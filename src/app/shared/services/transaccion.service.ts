import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { environment } from '@env/environment.development';
import { CreateTransaccionDto } from '@shared/dto/create-transaccion-dto';
import { UpdateTransaccionDto } from '@shared/dto/update-transaccion-dto ';
import { TipoTransaccionModel } from '@shared/models/tipo-transaccion-model';
import { TransaccionModel } from '@shared/models/transaccion-model';



@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  private http = inject(HttpClient);

  url:string = `transacciones`;

  constructor() { }

  getAll(){
    return this.http.get<TransaccionModel[]>(this.url)
  }

  create(data:CreateTransaccionDto){
    return this.http.
    post<TransaccionModel>(this.url,data);
  }
  update(data:UpdateTransaccionDto){
    const {id} = data;
    return this.http.put<TransaccionModel>(`${this.url}/${id}`,data);
  }

  delete (id:number){
    return this.http.delete(`${this.url}/${id}`);
  }
}

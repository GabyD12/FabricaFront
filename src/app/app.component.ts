import { CommonModule } from '@angular/common';
import { compileClassMetadata } from '@angular/compiler';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CreateTransaccionDto } from '@shared/dto/create-transaccion-dto';
import { TipoTransaccionModel } from '@shared/models/tipo-transaccion-model';
import { TransaccionModel } from '@shared/models/transaccion-model';
import { TipoTransaccionService } from '@shared/services/tipo-transaccion.service';
import { TransaccionService } from '@shared/services/transaccion.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    this.getData();
  }  

  private formBuilder=inject(FormBuilder)
  private transaccionService = inject (TransaccionService);
  private tipoTransaccionService = inject (TipoTransaccionService);

formTransaccion:FormGroup|null=null;
transacciones:TransaccionModel[] = []
tipotransacciones:TipoTransaccionModel[]=[];
  // {
  //   Monto:2000,
  //   Motivo:"regalo",
  // },


  // {
  //   Monto:3000,
  //   Motivo:"deuda",
  // }
 

transaccion:TransaccionModel|null = null;
indexTransaccion:number|null =null;

getData (){
  const dataSub = forkJoin ([
    this.transaccionService.getAll(),
    this.tipoTransaccionService.getAll()
  ]).subscribe({
    next:([transacciones, tipotransacciones])=>{
      this.transacciones = [...transacciones];
      this.tipotransacciones = [...tipotransacciones];
      
      
    },
    complete(){
      dataSub.unsubscribe();
    },
  })
}

 crearTransaccion(){
  this.formTransaccion= this.formBuilder.group({
    fecha:new FormControl(null,[Validators.required]),
    Monto:new FormControl(null,[Validators.required]),
    Motivo:new FormControl(null,[Validators.required]),
    id_tipo_transaccion:new FormControl(null,[Validators.required])
  });
  
 }
 actualizarTransaccion(transaccion:TransaccionModel,index:number){
  this.transaccion = transaccion;
  this.indexTransaccion = index;
  this.formTransaccion= this.formBuilder.group({
    Monto:new FormControl(this.transaccion.Monto,[Validators.required]),
    Motivo:new FormControl(this.transaccion.Motivo,[Validators.required])
  });
 }
 cancelarTransaccion(){
  this.formTransaccion=null;
  this.indexTransaccion=null;
  this.transaccion=null;
 }

 guardarTransaccion(){
  if(!this.formTransaccion||this.formTransaccion.invalid){
    alert("llenar todos los campos")
    return;

  }
  const{value}=this.formTransaccion;
  const nuevaTransaccion:CreateTransaccionDto = value as CreateTransaccionDto;

  const saveSub = this.transaccionService.create(nuevaTransaccion)
  .subscribe({
    next:(transaccion)=>{
      this.transacciones = [...this.transacciones,transaccion];
    },
    complete:()=>{
      saveSub.unsubscribe();
    },

  })
}
eliminarTransaccion(id:number){
const deleteSub = this.transaccionService.delete(id)
.subscribe({
  next:(value)=>{
let transacciones = [...this.transacciones];
let transaccion_index = transacciones.findIndex((transaccion)=>transaccion.id===id);
transacciones.splice(transaccion_index,1);
this.transacciones = transacciones;
  },
  complete:()=>{
      deleteSub.unsubscribe();
  },
})
}
}

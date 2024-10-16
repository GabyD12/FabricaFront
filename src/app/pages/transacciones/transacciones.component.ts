import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateTransaccionDto } from '@shared/dto/create-transaccion-dto';
import { UpdateTransaccionDto } from '@shared/dto/update-transaccion-dto ';
import { TipoTransaccionModel } from '@shared/models/tipo-transaccion-model';
import { TransaccionModel } from '@shared/models/transaccion-model';
import { TipoTransaccionService } from '@shared/services/tipo-transaccion.service';
import { TransaccionService } from '@shared/services/transaccion.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-transacciones',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './transacciones.component.html',
  styleUrl: './transacciones.component.css'
})
export class TransaccionesComponent {
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
 actualizarTransaccion(transaccion:TransaccionModel){
  this.formTransaccion= this.formBuilder.group({
    id:new FormControl(transaccion.id),
    Monto:new FormControl(transaccion.Monto,[Validators.required]),
    Motivo:new FormControl(transaccion.Motivo,[Validators.required]),
    fecha:new FormControl(transaccion.fecha,[Validators.required]),
    id_tipo_transaccion:new FormControl(transaccion.id_tipo_transaccion,[Validators.required]),
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

  const {value} = this.formTransaccion;
  console.log(this.formTransaccion.get('id'));

    if (this.formTransaccion.get('id')) {
      const nuevaTransaccion:UpdateTransaccionDto = value as UpdateTransaccionDto;
      const saveSub = this.transaccionService.update(nuevaTransaccion)
      .subscribe({
        next:(transaccion)=>{
          let transacciones = [...this.transacciones];
          let transaccion_index = transacciones.findIndex((transaccion)=>transaccion.id==nuevaTransaccion.id);
          transacciones[transaccion_index] = transaccion;
          this.transacciones = transacciones;
          this.cancelarTransaccion();
      },
      complete:()=>{
        saveSub.unsubscribe();
      },
    });
    return;
  }
  const nuevaTransaccion:CreateTransaccionDto = value as CreateTransaccionDto;
  const saveSub = this.transaccionService.create(nuevaTransaccion)
  .subscribe({
    next:(transaccion)=>{
      this.transacciones = [...this.transacciones,transaccion]
      this.cancelarTransaccion();
      },
      complete:()=>{
        saveSub.unsubscribe();
      }
  })
}

eliminarTransaccion(id:number){
  const deleteSub = this.transaccionService.delete(id)
  .subscribe({
    next:()=>{
      let transacciones = [...this.transacciones];
      let transacciones_index = transacciones.findIndex((transaccion)=>transaccion.id===id);
      transacciones.splice(transacciones_index, 1)
      this.transacciones = transacciones;
    },
    complete:()=>{
      deleteSub.unsubscribe();
    },
  })
}
}

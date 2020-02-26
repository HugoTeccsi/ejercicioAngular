import { Component } from '@angular/core';
import { FileReaderService } from './service/file-reader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ejercicio-front';
  departamento:any=[];
  mensaje:string;
  constructor(service:FileReaderService){
    console.log("inicio file");
    service.ReadFile();
    this.mensaje='Resultado en console :)';
  }
}

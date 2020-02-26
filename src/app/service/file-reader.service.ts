import { Injectable, MissingTranslationStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDepartamento } from '../model/Departamento';
import { IProvincia } from '../model/Provincia';
import { IDistrito } from '../model/Distrito';

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {

  private _http: HttpClient;
  convertEspaciosBlanco: string;
  convertCaracteres: string;

  constructor(http: HttpClient) {
    this._http = http;
  }


  ReadFile() {
    return this._http.get('./assets/file.txt', { responseType: 'blob' }).subscribe(data => {
      this.readFileTxt(data);
    },
      error => {
        console.log(error);
      });
  }

  readFileTxt(myTxt) {
    var myReader = new FileReader();

    myReader.addEventListener("loadend", (e: any) => {
      let dataUbigeo: any[] = [];
      let newDepartamento: Array<IDepartamento>;
      let newProvincia: Array<IProvincia>;
      let newDistriro: Array<IDistrito>;
      newDepartamento = [];
      newDistriro = [];
      newProvincia = [];
      let listDepartamento: Array<IDepartamento>;
      listDepartamento = [];
      let lisProvincia: Array<IProvincia>
      lisProvincia=[];
      const regExpEspBlanco = /['"/]+/g;
      const regExpCaracteres = /^\s+|\s+$|\s+(?=\s)/g;

      this.convertEspaciosBlanco = e.srcElement.result.replace(regExpEspBlanco, '');
      this.convertCaracteres = this.convertEspaciosBlanco.replace(regExpCaracteres, ",\n");
      dataUbigeo = this.convertCaracteres.split(',');
      dataUbigeo.forEach(item => {
        let codigoFile: string;
        let descFile: string;
        codigoFile = item.trim().substr(0, item.trim().indexOf(" "));
        //agrupando departamentos
        if (parseInt(codigoFile) > 0 && parseInt(codigoFile) < 50) {
          descFile = item.trim().substr(item.trim().lastIndexOf(" ") + 1);
          const codigoFileDepartamento = newDepartamento.filter(p => p.codigo === codigoFile);
          if (codigoFileDepartamento.length == 0) {
            newDepartamento.push({
              codigo: codigoFile,
              descripcion: descFile
            });
          }
        }
        //agrupando provincias
        if (parseInt(codigoFile) >= 50 && parseInt(codigoFile) < 100) {
          descFile = item.trim().substr(item.trim().lastIndexOf(" ") + 1);
          const codigoFileProvincia = newProvincia.filter(p => p.codigo === codigoFile);
          if (codigoFileProvincia.length == 0) {
            newProvincia.push({
              codigo: codigoFile,
              descripcion: descFile
            });
          }
        }
        //agrupando distritos
        if (parseInt(codigoFile) > 100 && parseInt(codigoFile) < 999) {
          descFile = item.trim().substr(item.trim().indexOf(" ") + 1);
          const codigoFileDistrito = newDistriro.filter(p => p.codigo === codigoFile);
          if (codigoFileDistrito.length == 0) {
            newDistriro.push({
              codigo: codigoFile,
              descripcion: descFile
            });
          }
        }
      });

      //Formando relación departamento / provincia
      let provinciaDept: Array<IProvincia> = [];
      let index:number;
      index=1;
      newDepartamento.forEach(data => {
        let valorMin=this.rangoMin(data.codigo);
        let valorMax=this.rangoMax(data.codigo);
        if (parseInt(data.codigo) == index) {
          provinciaDept = newProvincia.filter(p => parseInt(p.codigo) >= valorMin && parseInt(p.codigo) < valorMax)
          provinciaDept.forEach(item => {
            const codigoDept = listDepartamento.filter(p => p.codigo === data.codigo);
            if (codigoDept.length == 0) {
              listDepartamento.push({
                codigo: data.codigo,
                descripcion: data.descripcion,
                provincias: provinciaDept
              });
            }
          } );          
        }
        index++;
      });

      //Formando relación provincia / distrito
      let provinciaDistrito: Array<IDistrito> = [];
      newProvincia.forEach(data=>{
        if(data.codigo=='50'){
          provinciaDistrito=newDistriro.filter(p=>parseInt(p.codigo) < 250);
          provinciaDistrito.forEach(item=>{
            const codigoProv=lisProvincia.filter(p=>p.codigo===data.codigo);
            if(codigoProv.length==0){
              lisProvincia.push({
                codigo:data.codigo,
                descripcion:data.descripcion,
                distritos:provinciaDistrito
              })
            }
          });
        }

        if(data.codigo=='63'){
          provinciaDistrito=newDistriro.filter(p=>parseInt(p.codigo) > 250);
          provinciaDistrito.forEach(item=>{
            const codigoProv=lisProvincia.filter(p=>p.codigo===data.codigo);
            if(codigoProv.length==0){
              lisProvincia.push({
                codigo:data.codigo,
                descripcion:data.descripcion,
                distritos:provinciaDistrito
              })
            }
          });
        }
      });
      console.log("Lista Departamento: " + JSON.stringify(newDepartamento,null,'\t'));
      console.log("Lista Departamento / Provincia: " + JSON.stringify(listDepartamento,null,'\t'));
      console.log("Lista Provincia / Distrito: " + JSON.stringify(lisProvincia,null,'\t'));
      
    });
    myReader.readAsText(myTxt);
  }

  rangoMin(codigoDepartamento:string) : number {
    let min:number;
    if(codigoDepartamento==='01'){
      min=50;
    }
    if(codigoDepartamento==='02'){
      min=60;
    }
    return min;
  }

  rangoMax(codigoDepartamento:string) : number {
    let max:number;
    if(codigoDepartamento==='01'){
      max=60;
    }
    if(codigoDepartamento==='02'){
      max=100;
    }
    return max;
  }

  rangoMinProv(codigoProvincia:string) : number {
    let min:number;
    if(codigoProvincia==='50'){
      min=200;
    }
    if(codigoProvincia==='63'){
      min=267;
    }
    return min;
  }

  rangoMaxProv(codigoProvincia:string) : number {
    let max:number;
    if(codigoProvincia==='50'){
      max=210;
    }
    if(codigoProvincia==='63'){
      max=270;
    }
    return max;
  }
}

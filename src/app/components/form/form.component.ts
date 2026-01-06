
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import emailjs from 'emailjs-com';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import axios from 'axios';
import jsPDF from 'jspdf';
import { CommonModule, NgIf } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';




@Component({
  selector: 'app-form',
  imports: [NgSelectModule, FormsModule, ReactiveFormsModule, CommonModule, TranslocoModule, NgIf],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})


export class FormComponent {

  constructor(private snackBar: MatSnackBar, private router: Router, private translocoService: TranslocoService) {

    this.translocoService.setDefaultLang('es');
    this.translatedWayPage = this.wayPage.map(item => ({
      ...item,
    }));
  }






  //************************DATOS FISCALES**********************************

  personRegimen = 1; // o 'persona fisica' 1 es person física y 2 moral

  // Valores iniciales para los dropdowns
  regimenSeleccionado: any = { id: 616, nombre: "Sin obligaciones fiscales" };
  localSelected: any = { id: 0, nombre: "No seleccionado" };
  cfdiSelected: any = { "id": 22, "codigo": "S01", "descripcion": "Sin efectos fiscales." };
  wayPageSelected: any = { id: 0, codigo: "N/A", descripcion: "No seleccionado" };
  bankSelected: any = { id: 0, nombre: "No seleccionado" };

  rasonName: any = ""; // nombre (Obligatorio)
  rfc: any = ""; // (Obligatorio)
  callePerson: any = "";
  no_intPerson: number = 0;
  coloniaPerson: any = "";
  cpPerson: any = "";
  municipioPerson: any = "";
  poblationPerson: any = "";
  countryPerson: any = "";
  zone: any = "";
  telPerson: any = "";
  no_extPerson: number = 0;
  emailPerson: any = "";
  webPage: any = "";

  //******************************DOMICILIO DE INSTALACION******************************************

  calleInst: any = "";
  no_extInst: number = 0;
  no_intInst: number = 0;
  coloniaInst: any = "";
  cpInst: any = "";
  municipioInst: any = "";
  localInst: any = "";
  poblationInst: any = "";
  countryInst: any = "";
  zoneInst: any = "";
  telInst: any = "";

  //***********************INFORMACION DE FACTURACION**************************

  isFactu: boolean = false;
  nameFact: any = "";
  puestoFact: any = "";
  telFact: any = "";
  celFact: any = "";
  emailFact: any = "";

  aditionalData: any = "";

  //***************************INFORMACION COBRANZAS*****************************

  nameCobra: any = "";
  puestoCobra: any = "";
  telCobra: any = "";
  celCobra: any = "";
  emailCobra: any = "";

  //****************************INFORMACION BANCARIA**************************

  no_count: any = "";
  no_clabe: any = "";

  //****************************CONTACTO DE SITIO**************************

  ubicationSite: any = "";
  coordenadasSite: any = "";
  nameSite: any = "";
  telSite: any = "";
  celSite: any = "";
  depSite: any = "";
  timeSite: any = "";
  megasSite: any = "";
  noEnlace_sit: any = "";

  //****************************DATOS DEL VENDEDOR***************************

  nameVen: any = "";
  oficinaVen: any = "";
  emailSelected: any[] = [];
  celVen: any = "";

  //*****************************ARCHIVS**********************************
  bankFileName: string = '';
  zipFileName: string = '';

  fileBank: File | null = null;
  fileZip: File | null = null;



  regimenes = [
    { id: 601, nombre: "General de Ley Personas Morales" },
    { id: 603, nombre: "Personas Morales con Fines no Lucrativos" },
    { id: 605, nombre: "Sueldos y Salarios e Ingresos Asimilados a Salarios" },
    { id: 606, nombre: "Arrendamiento" },
    { id: 607, nombre: "Régimen de Enajenación o Adquisición de Bienes" },
    { id: 608, nombre: "Demás ingresos" },
    { id: 610, nombre: "Residentes en el Extranjero sin Establecimiento Permanente en México" },
    { id: 611, nombre: "Ingresos por Dividendos (socios y accionistas)" },
    { id: 612, nombre: "Personas Físicas con Actividades Empresariales y Profesionales" },
    { id: 614, nombre: "Ingresos por intereses" },
    { id: 615, nombre: "Régimen de los ingresos por obtención de premios" },
    { id: 616, nombre: "Sin obligaciones fiscales" },
    { id: 620, nombre: "Sociedades Cooperativas de Producción que optan por diferir sus ingresos" },
    { id: 621, nombre: "Incorporación Fiscal" },
    { id: 622, nombre: "Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
    { id: 623, nombre: "Opcional para Grupos de Sociedades" },
    { id: 624, nombre: "Coordinados" },
    { id: 625, nombre: "Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
    { id: 626, nombre: "Régimen Simplificado de Confianza" },
    { id: 627, nombre: "Publico General" }
  ]

  use_cfdi = [
    { "id": 1, "codigo": "G01", "descripcion": "Adquisición de mercancías." },
    { "id": 2, "codigo": "G02", "descripcion": "Devoluciones, descuentos o bonificaciones." },
    { "id": 3, "codigo": "G03", "descripcion": "Gastos en general." },
    { "id": 4, "codigo": "I01", "descripcion": "Construcciones." },
    { "id": 5, "codigo": "I02", "descripcion": "Mobiliario y equipo de oficina por inversiones." },
    { "id": 6, "codigo": "I03", "descripcion": "Equipo de transporte." },
    { "id": 7, "codigo": "I04", "descripcion": "Equipo de cómputo y accesorios." },
    { "id": 8, "codigo": "I05", "descripcion": "Dados, troqueles, moldes, matrices y herramental." },
    { "id": 9, "codigo": "I06", "descripcion": "Comunicaciones telefónicas." },
    { "id": 10, "codigo": "I07", "descripcion": "Comunicaciones satelitales." },
    { "id": 11, "codigo": "I08", "descripcion": "Otra maquinaria y equipo." },
    { "id": 12, "codigo": "D01", "descripcion": "Honorarios médicos, dentales y gastos hospitalarios." },
    { "id": 13, "codigo": "D02", "descripcion": "Gastos médicos por incapacidad o discapacidad." },
    { "id": 14, "codigo": "D03", "descripcion": "Gastos funerales." },
    { "id": 15, "codigo": "D04", "descripcion": "Donativos." },
    { "id": 16, "codigo": "D05", "descripcion": "Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación)." },
    { "id": 17, "codigo": "D06", "descripcion": "Aportaciones voluntarias al SAR." },
    { "id": 18, "codigo": "D07", "descripcion": "Primas por seguros de gastos médicos." },
    { "id": 19, "codigo": "D08", "descripcion": "Gastos de transportación escolar obligatoria." },
    { "id": 20, "codigo": "D09", "descripcion": "Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones." },
    { "id": 21, "codigo": "D10", "descripcion": "Pagos por servicios educativos (colegiaturas)." },
    { "id": 22, "codigo": "S01", "descripcion": "Sin efectos fiscales." },
    { "id": 23, "codigo": "CP01", "descripcion": "Pagos." },
    { "id": 24, "codigo": "CN01", "descripcion": "Nómina." }
  ];




  emailsPdnt = [
    { id: 1, email: "suemy.avila@elpoderdeinternet.mx" },
    { id: 2, email: "carlos.escalona@elpoderdeinternet.mx" },
    { id: 3, email: "genesis.mercado@elpoderdeinternet.mx" },
    { id: 4, email: "deysimar.jimenez@elpoderdeinternet.mx" },
    { id: 5, email: "administracion@elpoderdeinternet.mx" },
    { id: 6, email: "ventas@elpoderdeinternet.mx" },
    { id: 7, email: "jorge.ceron@elpoderdeinternet.mx" },
  ];


  wayPage = [
    { "id": 1, "codigo": "01", "descripcion": "Efectivo" },
    { "id": 2, "codigo": "02", "descripcion": "Cheque nominativo" },
    { "id": 3, "codigo": "03", "descripcion": "Transferencia electrónica de fondos" },
    { "id": 4, "codigo": "04", "descripcion": "Tarjeta de crédito" },
    { "id": 5, "codigo": "05", "descripcion": "Monedero electrónico" },
    { "id": 6, "codigo": "06", "descripcion": "Dinero electrónico" },
    { "id": 7, "codigo": "08", "descripcion": "Vales de despensa" },
    { "id": 8, "codigo": "12", "descripcion": "Dación en pago" },
    { "id": 9, "codigo": "13", "descripcion": "Pago por subrogación" },
    { "id": 10, "codigo": "14", "descripcion": "Pago por consignación" },
    { "id": 11, "codigo": "15", "descripcion": "Condonación" },
    { "id": 12, "codigo": "17", "descripcion": "Compensación" },
    { "id": 13, "codigo": "23", "descripcion": "Novación" },
    { "id": 14, "codigo": "24", "descripcion": "Confusión" },
    { "id": 15, "codigo": "25", "descripcion": "Remisión de deuda" },
    { "id": 16, "codigo": "26", "descripcion": "Prescripción o caducidad" },
    { "id": 17, "codigo": "27", "descripcion": "A satisfacción del acreedor" },
    { "id": 18, "codigo": "28", "descripcion": "Tarjeta de débito" },
    { "id": 19, "codigo": "29", "descripcion": "Tarjeta de servicios" },
    { "id": 20, "codigo": "30", "descripcion": "Aplicación de anticipos" },
    { "id": 21, "codigo": "31", "descripcion": "Intermediario pagos" },
    { "id": 22, "codigo": "99", "descripcion": "Por definir" }
  ]
  //Inicializamos para no modificar los datos originales
  public translatedWayPage: any[] = this.wayPage.map(item => ({
    ...item,
  }));
  public translatedCfdi: any[] = this.use_cfdi.map(item => ({
    ...item,
  }));
  public translatedRegimenes: any[] = this.regimenes.map(item => ({
    ...item,
  }));

  public useDataPCobra() {

    this.nameCobra = this.rasonName;
    this.telCobra = this.telPerson;
    this.celCobra = this.telPerson;
    this.emailCobra = this.emailPerson;
    console.log('Datos de contacto copiados a cobranza');


  }
  public useDataPFactu() {
    this.nameFact = this.rasonName;
    this.telFact = this.telPerson;
    this.celFact = this.telPerson;
    this.emailFact = this.emailPerson;
    console.log('Datos de contacto copiados a facturación');

    if (this.nameFact == '' && this.telFact == '' &&
      this.celFact == '' && this.emailFact == '') {
      this.snackBar.open('No hay datos', 'Cerrar', {
        duration: 3000, // Duración en milisegundos
        verticalPosition: 'top', // Posición vertical: 'top' o 'bottom'
        horizontalPosition: 'center' // Posición horizontal: 'start', 'center', 'end', 'left', 'right'
      });
    }
  }
  public triggerShake() {
    let fs = document.getElementById('facturacionFieldset');
    if (!fs) return;
    fs.classList.remove('shake');   // quitar si ya estaba
    void fs.offsetWidth;            // forzar reflow
    fs.classList.add('shake');      // volver a aplicar
  }


  changeLang(event: Event): void {
    const lang = (event.target as HTMLSelectElement).value;
    this.translocoService.setActiveLang(lang);




    setTimeout(() => {
      this.translatedWayPage = this.wayPage.map(item => ({
        ...item,
        descripcion: this.translocoService.translate(item.descripcion)
      }));

      this.translatedCfdi = this.use_cfdi.map(item => ({
        ...item,
        descripcion: this.translocoService.translate(item.descripcion)
      }));

      this.translatedRegimenes = this.regimenes.map(item => ({
        ...item,
        nombre: this.translocoService.translate(item.nombre)
      }));

      this.regimenSeleccionado = { id: 0, nombre: this.translocoService.translate('No seleccionado') };
      this.localSelected = { id: 0, nombre: this.translocoService.translate('No seleccionado') };
      this.cfdiSelected = { id: 0, codigo: 'N/A', descripcion: this.translocoService.translate('No seleccionado') };
      this.wayPageSelected = { id: 0, codigo: 'N/A', descripcion: this.translocoService.translate('No seleccionado') };
      this.bankSelected = { id: 0, nombre: this.translocoService.translate('No seleccionado') };
    }, 300);

  }








  banks = [
    { "id": 1, "nombre": "ABC Capital" },
    //{ "id": 2, "nombre": "American Express Bank (México)" },
    { "id": 3, "nombre": "Banca Afirme" },
    { "id": 4, "nombre": "Banca Mifel" },
    { "id": 5, "nombre": "Banco Actinver" },
    { "id": 6, "nombre": "Banco Ahorro Famsa" },
    { "id": 7, "nombre": "Banco Autofin México" },
    { "id": 8, "nombre": "Banco Azteca" },
    { "id": 9, "nombre": "Banco Bancrea" },
    { "id": 10, "nombre": "Banco Base" },
    { "id": 11, "nombre": "Banco Compartamos" },
    { "id": 12, "nombre": "Banco Credit Suisse (México)" },
    { "id": 13, "nombre": "Banco del Bajio" },
    { "id": 14, "nombre": "Banco Forjadores" },
    { "id": 15, "nombre": "Banco Inbursa" },
    { "id": 16, "nombre": "Banco Inmobiliario Mexicano" },
    { "id": 17, "nombre": "Banco Interacciones" },
    { "id": 18, "nombre": "Banco Invex" },
    { "id": 19, "nombre": "Banco J.P. Morgan" },
    { "id": 20, "nombre": "Banco Mercantil del Norte (Banorte)" },
    { "id": 21, "nombre": "Banco Monex" },
    { "id": 22, "nombre": "Banco Multiva" },
    { "id": 23, "nombre": "Banco Nacional de México (Banamex)" },
    { "id": 24, "nombre": "Banco Pagatodo" },
    { "id": 25, "nombre": "Banco Regional de Monterrey" },
    { "id": 26, "nombre": "Banco Santander (México)" },
    { "id": 27, "nombre": "Banco Ve Por Mas" },
    { "id": 28, "nombre": "Banco Wal-Mart de México" },
    { "id": 29, "nombre": "Bancoppel" },
    { "id": 30, "nombre": "Bank of America México" },
    { "id": 31, "nombre": "Bank of Tokyo-Mitsubishi UFJ (México)" },
    { "id": 32, "nombre": "Bankaool" },
    { "id": 33, "nombre": "Bansi" },
    { "id": 34, "nombre": "Barclays Bank México" },
    { "id": 35, "nombre": "BBVA Bancomer" },
    { "id": 36, "nombre": "CiBanco" },
    { "id": 37, "nombre": "ConsuBanco" },
    { "id": 38, "nombre": "Deutsche Bank México" },
    { "id": 39, "nombre": "Fundación Donde Banco" },
    { "id": 40, "nombre": "HSBC México" },
    { "id": 41, "nombre": "Intercam Banco" },
    { "id": 42, "nombre": "Investa Bank" },
    { "id": 43, "nombre": "Scotiabank Inverlat" },
    { "id": 44, "nombre": "UBS Bank México" },
    { "id": 45, "nombre": "Volkswagen Bank" }
  ]



  local = [
    { "id": 1, "c_Estado": "AGU", "c_Pais": "MEX", "nombre": "Aguascalientes" },
    { "id": 2, "c_Estado": "BCN", "c_Pais": "MEX", "nombre": "Baja California" },
    { "id": 3, "c_Estado": "BCS", "c_Pais": "MEX", "nombre": "Baja California Sur" },
    { "id": 4, "c_Estado": "CAM", "c_Pais": "MEX", "nombre": "Campeche" },
    { "id": 5, "c_Estado": "CHP", "c_Pais": "MEX", "nombre": "Chiapas" },
    { "id": 6, "c_Estado": "CHH", "c_Pais": "MEX", "nombre": "Chihuahua" },
    { "id": 7, "c_Estado": "COA", "c_Pais": "MEX", "nombre": "Coahuila" },
    { "id": 8, "c_Estado": "COL", "c_Pais": "MEX", "nombre": "Colima" },
    { "id": 9, "c_Estado": "CMX", "c_Pais": "MEX", "nombre": "Ciudad de México" },
    { "id": 10, "c_Estado": "DUR", "c_Pais": "MEX", "nombre": "Durango" },
    { "id": 11, "c_Estado": "GUA", "c_Pais": "MEX", "nombre": "Guanajuato" },
    { "id": 12, "c_Estado": "GRO", "c_Pais": "MEX", "nombre": "Guerrero" },
    { "id": 13, "c_Estado": "HID", "c_Pais": "MEX", "nombre": "Hidalgo" },
    { "id": 14, "c_Estado": "JAL", "c_Pais": "MEX", "nombre": "Jalisco" },
    { "id": 15, "c_Estado": "MEX", "c_Pais": "MEX", "nombre": "Estado de México" },
    { "id": 16, "c_Estado": "MIC", "c_Pais": "MEX", "nombre": "Michoacán" },
    { "id": 17, "c_Estado": "MOR", "c_Pais": "MEX", "nombre": "Morelos" },
    { "id": 18, "c_Estado": "NAY", "c_Pais": "MEX", "nombre": "Nayarit" },
    { "id": 19, "c_Estado": "NLE", "c_Pais": "MEX", "nombre": "Nuevo León" },
    { "id": 20, "c_Estado": "OAX", "c_Pais": "MEX", "nombre": "Oaxaca" },
    { "id": 21, "c_Estado": "PUE", "c_Pais": "MEX", "nombre": "Puebla" },
    { "id": 22, "c_Estado": "QUE", "c_Pais": "MEX", "nombre": "Querétaro" },
    { "id": 23, "c_Estado": "ROO", "c_Pais": "MEX", "nombre": "Quintana Roo" },
    { "id": 24, "c_Estado": "SLP", "c_Pais": "MEX", "nombre": "San Luis Potosí" },
    { "id": 25, "c_Estado": "SIN", "c_Pais": "MEX", "nombre": "Sinaloa" },
    { "id": 26, "c_Estado": "SON", "c_Pais": "MEX", "nombre": "Sonora" },
    { "id": 27, "c_Estado": "TAB", "c_Pais": "MEX", "nombre": "Tabasco" },
    { "id": 28, "c_Estado": "TAM", "c_Pais": "MEX", "nombre": "Tamaulipas" },
    { "id": 29, "c_Estado": "TLA", "c_Pais": "MEX", "nombre": "Tlaxcala" },
    { "id": 30, "c_Estado": "VER", "c_Pais": "MEX", "nombre": "Veracruz" },
    { "id": 31, "c_Estado": "YUC", "c_Pais": "MEX", "nombre": "Yucatán" },
    { "id": 32, "c_Estado": "ZAC", "c_Pais": "MEX", "nombre": "Zacatecas" }
  ]


  public printAllData(): void {
    console.log('*************** DATOS FISCALES ***************');
    console.log('rasonName:', this.rasonName);
    console.log('regimenSeleccionado:', this.regimenSeleccionado);
    console.log('rfc:', this.rfc);
    console.log('callePerson:', this.callePerson);
    console.log('no_intPerson:', this.no_intPerson);
    console.log('coloniaPerson:', this.coloniaPerson);
    console.log('cpPerson:', this.cpPerson);
    console.log('municipioPerson:', this.municipioPerson);
    console.log('localSelected (Estado):', this.localSelected);
    console.log('poblationPerson:', this.poblationPerson);
    console.log('countryPerson:', this.countryPerson);
    console.log('zone:', this.zone);
    console.log('telPerson:', this.telPerson);
    console.log('no_extPerson:', this.no_extPerson);
    console.log('emailPerson:', this.emailPerson);
    console.log('webPage:', this.webPage);

    console.log('********** DOMICILIO DE INSTALACION **********');
    console.log('calleInst:', this.calleInst);
    console.log('no_extInst:', this.no_extInst);
    console.log('no_intInst:', this.no_intInst);
    console.log('coloniaInst:', this.coloniaInst);
    console.log('cpInst:', this.cpInst);
    console.log('municipioInst:', this.municipioInst);
    console.log('localInst:', this.localInst);
    console.log('poblationInst:', this.poblationInst);
    console.log('countryInst:', this.countryInst);
    console.log('zoneInst:', this.zoneInst);
    console.log('telInst:', this.telInst);

    console.log('******** INFORMACION DE FACTURACION *********');
    console.log('nameFact:', this.nameFact);
    console.log('puestoFact:', this.puestoFact);
    console.log('telFact:', this.telFact);
    console.log('celFact:', this.celFact);
    console.log('emailFact:', this.emailFact);
    console.log('cfdiSelected:', this.cfdiSelected);
    console.log('wayPageSelected:', this.wayPageSelected);
    console.log('aditionalData:', this.aditionalData);

    console.log('************* INFORMACION COBRANZAS *************');
    console.log('nameCobra:', this.nameCobra);
    console.log('puestoCobra:', this.puestoCobra);
    console.log('telCobra:', this.telCobra);
    console.log('celCobra:', this.celCobra);
    console.log('emailCobra:', this.emailCobra);

    console.log('************* INFORMACION BANCARIA *************');
    console.log('no_count:', this.no_count);
    console.log('no_clabe:', this.no_clabe);
    console.log('bankSelected:', this.bankSelected);

    console.log('************ CONTACTO DE SITIO ************');
    console.log('ubicationSite:', this.ubicationSite);
    console.log('coordenadasSite:', this.coordenadasSite);
    console.log('nameSite:', this.nameSite);
    console.log('telSite:', this.telSite);
    console.log('celSite:', this.celSite);
    console.log('depSite:', this.depSite);
    console.log('timeSite:', this.timeSite);
    console.log('megasSite:', this.megasSite);
    console.log('noEnlace_sit:', this.noEnlace_sit);

    console.log('************ DATOS DEL VENDEDOR ************');
    console.log('nameVen:', this.nameVen);
    console.log('oficinaVen:', this.oficinaVen);
    console.log('emailSelected:', this.emailSelected);
    console.log('celVen:', this.celVen);
  }





  public templatePlainText(): string {
    const textTemp = `
  DATOS FISCALES
  -----------------------------------------
  Razón Social / Nombre: ${this.rasonName}
  Régimen Fiscal:  ${this.regimenSeleccionado.id} ${this.regimenSeleccionado.nombre}
  RFC: ${this.rfc}
  Calle: ${this.callePerson}
  N° Int: ${this.no_intPerson}
  N° Ext: ${this.no_extPerson}
  Colonia: ${this.coloniaPerson}
  C.P.: ${this.cpPerson}
  Municipio: ${this.municipioPerson}
  Estado: ${this.localSelected}
  Población: ${this.poblationPerson}
  País: ${this.countryPerson}
  Zona: ${this.zone}
  Teléfono: ${this.telPerson}
  Correo Electrónico: ${this.emailPerson}
  Página Web: ${this.webPage}
  
  DOMICILIO DE INSTALACIÓN
  -----------------------------------------
  Calle: ${this.calleInst}
  N° Ext: ${this.no_extInst}
  N° Int: ${this.no_intInst}
  Colonia: ${this.coloniaInst}
  C.P.: ${this.cpInst}
  Municipio: ${this.municipioInst}
  Estado: ${this.localInst}
  Población: ${this.poblationInst}
  País: ${this.countryInst}
  Zona: ${this.zoneInst}
  Teléfono: ${this.telInst}
  
  INFORMACIÓN PARA FACTURACIÓN
  -----------------------------------------
  Nombre Encargado: ${this.nameFact}
  Puesto: ${this.puestoFact}
  Teléfono: ${this.telFact}
  Celular: ${this.celFact}
  Correo Electrónico: ${this.emailFact}
  CFDI: ${this.cfdiSelected}
  Método de pago: ${this.wayPageSelected}
  Datos Adicionales: ${this.aditionalData}
  
  INFORMACIÓN DE COBRANZA
  -----------------------------------------
  Nombre Encargado: ${this.nameCobra}
  Puesto: ${this.puestoCobra}
  Teléfono: ${this.telCobra}
  Celular: ${this.celCobra}
  Correo Electrónico: ${this.emailCobra}
  
  INFORMACIÓN BANCARIA
  -----------------------------------------
  N° de Cuenta: ${this.no_count}
  N° de Cuenta Clabe: ${this.no_clabe}
  Banco: ${this.bankSelected}
  
  CONTACTO DE SITIO
  -----------------------------------------
  Ubicación: ${this.ubicationSite}
  Coordenadas: ${this.coordenadasSite}
  Nombre Contacto Sitio: ${this.nameSite}
  Teléfono: ${this.telSite}
  Celular: ${this.celSite}
  Departamento: ${this.depSite}
  Horario de atención: ${this.timeSite}
  Megas Aproximados: ${this.megasSite}
  Número de Enlaces: ${this.noEnlace_sit}
  
  DATOS DEL VENDEDOR
  -----------------------------------------
  Nombre Vendedor: ${this.nameVen}
  Oficina: ${this.oficinaVen}
  Correos (EmailSelected): ${this.emailSelected}
  Celular Vendedor: ${this.celVen}
  `;

    return textTemp;
  }



  sendEmail(data: any, email: any) {

    const serviceID = environment.SERVICE_ID;
    const templateID = environment.TEMPLATE_ID;
    const publicKey = environment.TEMPLATE_ID; // A veces se llama 'user_ID'
    const templateParams = {
      to_name: 'Administracion Clientes',
      from_name: 'Jesus Manuel Lara',
      message_data: data,
      to_email: email
    };

    /*emailjs.send("service_7zmw1ej", "template_aqfj7ic", templateParams)
      .then((response: EmailJSResponseStatus) => {
        console.log('Correo enviado!', response.status, response.text);
      })
      .catch((error) => {
        console.error('Error al enviar correo:', error);
      });*/
    emailjs.send("service_7zmw1ej", "template_aqfj7ic", {
      message_html: data,
      to_email: email,
    }, "5zGkMGh4g0QT20ubb");
  }





  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      if (fileType === 'bankFile') {
        this.bankFileName = input.files[0].name;
        this.fileBank = input.files[0];
      } else if (fileType === 'zipFile') {
        this.zipFileName = input.files[0].name;
        this.fileZip = input.files[0];
      }
    } else {
      if (fileType === 'bankFile') {
        this.bankFileName = 'Ningún archivo seleccionado';
      } else if (fileType === 'zipFile') {
        this.zipFileName = 'Ningún archivo seleccionado';
      }
    }
  }


  public async useNodeMailer(emails: any) {
    console.log("Desde la funcion useNodeMailer: ", emails);
    let itsAllOK = false;



    this.router.navigate(['/error']);

    // Variables para almacenar base64 de PDF y ZIP
    let base64Pdf: string | null = null;
    let base64Zip: string | null = null;

    // Crearemos dos FileReader, pero solo si existen los archivos
    let readerPdf: FileReader | null = null;
    let readerZip: FileReader | null = null;

    let pdfReady = false;
    let zipReady = false;

    const checkAndSend = async () => {
      if ((this.fileBank && !pdfReady) || (this.fileZip && !zipReady)) return;
      await trySendEmail();
    };



    // Función para INTENTAR enviar el correo cuando tengamos la info necesaria
    const trySendEmail = async () => {

      // Construir el array de attachments
      const attachmentsArray = [];

      if (base64Pdf) {
        attachmentsArray.push({
          filename: 'CaratulaBancariaCliente.pdf',
          content: base64Pdf,
          encoding: 'base64'
        });
      }
      if (base64Zip) {
        attachmentsArray.push({
          filename: 'DocumentosComprimidos.zip',
          content: base64Zip,
          encoding: 'base64'
        });
      }

      // Construir el body con ambos adjuntos
      const body = {
        to: emails,
        subject: 'ALTA DE CLIENTES',
        text: `¡Hola! te entrego el Alta de clientes: ${this.rasonName} 😊👌 ➡️`,
        attachments: attachmentsArray,
        variables: [
          {
            "datos_fiscales": {
              "razon_social": this.rasonName,
              "regimen_fiscal": {
                "id": this.regimenSeleccionado.id,
                "nombre": this.regimenSeleccionado.nombre
              },
              "rfc": this.rfc,
              "calle": this.callePerson,
              "numero_interior": this.no_intPerson,
              "numero_exterior": this.no_extPerson,
              "colonia": this.coloniaPerson,
              "codigo_postal": this.cpPerson,
              "municipio": this.municipioPerson,
              "estado": this.localSelected.nombre,
              "poblacion": this.poblationPerson,
              "pais": this.countryPerson,
              "zona": this.zone,
              "telefono": this.telPerson,
              "correo_electronico": this.emailPerson,
              "pagina_web": this.webPage
            },
            "domicilio_instalacion": {
              "calle": this.calleInst,
              "numero_exterior": this.no_extInst,
              "numero_interior": this.no_intInst,
              "colonia": this.coloniaInst,
              "codigo_postal": this.cpInst,
              "municipio": this.municipioInst,
              "estado": this.localInst,
              "poblacion": this.poblationInst,
              "pais": this.countryInst,
              "zona": this.zoneInst,
              "telefono": this.telInst
            },
            "informacion_facturacion": {
              "nombre_encargado": this.nameFact,
              "puesto": this.puestoFact,
              "telefono": this.telFact,
              "celular": this.celFact,
              "correo_electronico": this.emailFact,
              "cfdi": this.cfdiSelected.descripcion,
              "metodo_pago": this.wayPageSelected.descripcion,
              "datos_adicionales": this.aditionalData
            },
            "informacion_cobranza": {
              "nombre_encargado": this.nameCobra,
              "puesto": this.puestoCobra,
              "telefono": this.telCobra,
              "celular": this.celCobra,
              "correo_electronico": this.emailCobra
            },
            "informacion_bancaria": {
              "numero_cuenta": this.no_count,
              "numero_cuenta_clabe": this.no_clabe,
              "banco": this.bankSelected.nombre
            },
            "contacto_sitio": {
              "ubicacion": this.ubicationSite,
              "coordenadas": this.coordenadasSite,
              "nombre_contacto_sitio": this.nameSite,
              "telefono": this.telSite,
              "celular": this.celSite,
              "departamento": this.depSite,
              "horario_atencion": this.timeSite,
              "megas_aproximados": this.megasSite,
              "numero_enlaces": this.noEnlace_sit
            },
            "datos_vendedor": {
              "nombre_vendedor": this.nameVen,
              "oficina": this.oficinaVen,
              "correos": this.emailSelected.map(item => item.email).join(", "),
              "celular_vendedor": this.celVen
            }
          }
        ]
      };



      // Enviar la petición al servidor 
      this.generatePDF();

      //https://email-own.vercel.app/send-email
      try {
        const response = await axios.post('https://emailown.fly.dev/send-email', body);
        console.log('Archivos enviados exitosamente:', response);

        await this.router.navigate(['/gratitude']);
      } catch (error) {
        console.error('Error al enviar los archivos', error);

        await this.router.navigate(['/error']);
      }


    }
    if (this.fileBank) {
      readerPdf = new FileReader();
      readerPdf.onload = async () => {
        console.log("PDF leído correctamente");
        base64Pdf = (readerPdf!.result as string).split(',')[1];
        pdfReady = true;
        checkAndSend();
      };

      readerPdf.readAsDataURL(this.fileBank);
    } else {
      pdfReady = true;
    }

    if (this.fileZip) {
      readerZip = new FileReader();
      readerZip.onload = async () => {
        console.log("ZIP leído correctamente");
        base64Zip = (readerZip!.result as string).split(',')[1];
        zipReady = true;
        checkAndSend();
      };

      readerZip.readAsDataURL(this.fileZip);
    } else {
      zipReady = true;
    }
    // Si no hay PDF ni ZIP, enviamos sin adjuntos
    if (!this.fileBank && !this.fileZip) {
      await trySendEmail();
    }
  }



  public async submitAll(): Promise<void> {


    if (this.rasonName == "" || this.regimenSeleccionado == ""
      || this.telPerson == ""
      || this.emailPerson == "" || this.celCobra == "" || this.emailCobra == "") {

      this.snackBar.open('Por favor, complete todos los campos obligatorios.', 'Cerrar', {
        duration: 3000, // Duración en milisegundos
        verticalPosition: 'top', // Posición vertical: 'top' o 'bottom'
        horizontalPosition: 'center' // Posición horizontal: 'start', 'center', 'end', 'left', 'right'
      });
      return;

    }



    // Validar extensión .pdf si fileBank está definido
    if (this.fileBank) {
      const pdfOk = this.fileBank.name.toLowerCase().endsWith('.pdf');
      if (!pdfOk) {
        this.snackBar.open('El archivo de Carátula debe ser PDF.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        return;
      }
    }

    if ((this.fileZip?.size ?? 0) > 50 * 1048576) {
      this.snackBar.open('El archivo debe ser un PDF y el ZIP debe tener un tamaño máximo de 17MB.', 'Cerrar', {
        duration: 3000, // Duración en milisegundos
        verticalPosition: 'bottom', // Posición vertical: 'top' o 'bottom'
        horizontalPosition: 'center' // Posición horizontal: 'start', 'center', 'end', 'left', 'right'
      });
      return;
    }


    // Validar extensión .zip si fileZip está definido
    if (this.fileZip) {
      const zipOk = this.fileZip.name.toLowerCase().endsWith('.zip');
      if (!zipOk) {
        this.snackBar.open('El archivo ZIP debe tener extensión .zip.', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        return;
      }
    }

    if (this.emailSelected.length < 1) {

      this.snackBar.open('Seleccione al menos un correo.', 'Cerrar', {
        duration: 3000, // Duración en milisegundos
        verticalPosition: 'bottom', // Posición vertical: 'top' o 'bottom'
        horizontalPosition: 'center'
        // Posición horizontal: 'start', 'center', 'end', 'left', 'right'
      });

      return;


    }




    //Correo fijo push isiaí
    const emailUnique = { id: 8, email: "Isai.ortiz@elpoderdeinternet.mx" };
    this.emailSelected.push(emailUnique);
    const emails = this.emailSelected;


    console.log("Correos selecionados ", emails);


    if (emails) {

      this.useNodeMailer(emails);




    }

    /*for (const object of this.emailSelected) {//consjunto de emails seleccionados


      const email = object.email;//<-- es un objeto
      // this.printAllData();
      console.log("Deberia imprimir: ", email)
      console.log("El id es: ", email.id);
      console.log("Correo selccionado: ", email);
      if (email) {
        this.router.navigate(['/load']);
        this.useNodeMailer(email);
        console.log("Exito al mandar el correo ", object.id);

      }
    }*/



    console.log("No termina");

  }

  generatePDF() {
    const doc = new jsPDF();
    let y = 10; // posición vertical inicial

    const addLine = (text: string, space = 10) => {
      doc.text(text, 10, y);
      y += space;
    };


    // Sección: Encabezado
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    addLine('ALTA DE CLIENTES');
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    addLine(`Hola ${this.rasonName}`);

    // Datos Fiscales
    addLine('Datos Fiscales', 12);
    addLine(`Razón Social: ${this.rasonName}`);
    addLine(`Régimen Fiscal: ${this.regimenSeleccionado?.nombre} (ID: ${this.regimenSeleccionado?.id})`);
    addLine(`RFC: ${this.rfc}`);
    addLine(`Domicilio: ${this.callePerson} ${this.no_extPerson || ''} ${this.no_intPerson || ''}, ${this.coloniaPerson}, ${this.municipioPerson}, ${this.localSelected?.nombre}, ${this.poblationPerson}, C.P. ${this.cpPerson}`);
    addLine(`País: ${this.countryPerson}, Zona: ${this.zone}`);
    addLine(`Teléfono: ${this.telPerson}, Correo Electrónico: ${this.emailPerson}`);

    // Domicilio de Instalación
    addLine('Domicilio de Instalación', 12);
    addLine(`Calle: ${this.calleInst}, No. Exterior: ${this.no_extInst}, No. Interior: ${this.no_intInst}`);
    addLine(`Colonia: ${this.coloniaInst}, C.P. ${this.cpInst}, Municipio: ${this.municipioInst}, Estado: ${this.localInst}`);
    addLine(`País: ${this.countryInst}, Zona: ${this.zoneInst}, Teléfono: ${this.telInst}`);

    // Información de Facturación
    addLine('Información de Facturación', 12);
    addLine(`Nombre Encargado: ${this.nameFact}, Puesto: ${this.puestoFact}`);
    addLine(`Teléfono: ${this.telFact}, Celular: ${this.celFact}, Correo Electrónico: ${this.emailFact}`);
    addLine(`CFDI: ${this.cfdiSelected?.descripcion}, Método de Pago: ${this.wayPageSelected?.descripcion}`);
    addLine(`Datos Adicionales: ${this.aditionalData}`);

    // Información de Cobranza
    addLine('Información de Cobranza', 12);
    addLine(`Nombre Encargado: ${this.nameCobra}, Puesto: ${this.puestoCobra}`);
    addLine(`Teléfono: ${this.telCobra}, Celular: ${this.celCobra}, Correo Electrónico: ${this.emailCobra}`);

    // Información Bancaria
    addLine('Información Bancaria', 12);
    addLine(`Número de Cuenta: ${this.no_count}, CLABE: ${this.no_clabe}, Banco: ${this.bankSelected?.nombre}`);

    // Contacto del Sitio
    addLine('Contacto del Sitio', 12);
    addLine(`Ubicación: ${this.ubicationSite}, Coordenadas: ${this.coordenadasSite}`);
    addLine(`Nombre Contacto: ${this.nameSite}, Teléfono: ${this.telSite}, Celular: ${this.celSite}`);
    addLine(`Departamento: ${this.depSite}, Horario de Atención: ${this.timeSite}`);
    addLine(`Megas Aproximados: ${this.megasSite}, Número de Enlaces: ${this.noEnlace_sit}`);

    // Datos del Vendedor
    addLine('Datos del Vendedor', 12);
    addLine(`Nombre Vendedor: ${this.nameVen}, Oficina: ${this.oficinaVen}`);
    addLine(`Correos: ${this.emailSelected?.map(item => item.email).join(', ')}`);
    addLine(`Celular: ${this.celVen}`);

    setTimeout(() => {
      doc.save('Alta_Pdnt.pdf');
    }, 10000); // Espera 10 segundos antes de guardar el PDF
  }

}

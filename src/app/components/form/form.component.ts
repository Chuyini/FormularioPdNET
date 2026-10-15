import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { AltaService } from '../../services/alta.service';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';

/** Siempre recibe copia del alta, además de los correos que elija el vendedor */
const DESTINATARIO_FIJO = 'Isai.ortiz@elpoderdeinternet.mx';

const MB = 1024 * 1024;
const MAX_ZIP_MB = 50;
const MAX_PDF_MB = 10;

/** Texto en mayúsculas sin tronar si el valor es null/undefined (pasa al vaciar un ng-select) */
const may = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim().toUpperCase());
const txt = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim());
const soloDigitos = (v: unknown) => txt(v).replace(/\D/g, '');

const leerBase64 = (archivo: File) =>
  new Promise<string>((resolve, reject) => {
    const lector = new FileReader();
    lector.onload = () => resolve(String(lector.result).split(',')[1]);
    lector.onerror = () => reject(lector.error);
    lector.readAsDataURL(archivo);
  });

interface ErrorCampo {
  id: string; // id del input, para marcarlo y desplazarse a él
  mensaje: string; // llave de traducción
}

@Component({
  selector: 'app-form',
  imports: [NgSelectModule, FormsModule, TranslocoModule, LanguageSwitcherComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private transloco = inject(TranslocoService);
  private altaService = inject(AltaService);

  constructor() {
    // Traduce los catálogos cada vez que se carga un idioma, sin perder lo que ya se eligió
    this.transloco
      .selectTranslation()
      .pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe(() => this.traducirCatalogos());
  }

  //************************ DATOS FISCALES **********************************

  regimenSeleccionado: any = { id: 616, nombre: 'Sin obligaciones fiscales' };
  localSelected: any = null;
  cfdiSelected: any = { id: 22, codigo: 'S01', descripcion: 'Sin efectos fiscales.' };
  wayPageSelected: any = null;
  bankSelected: any = null;

  rasonName = ''; // Obligatorio
  rfc = '';
  callePerson = '';
  no_intPerson = '';
  no_extPerson = '';
  coloniaPerson = '';
  cpPerson = '';
  municipioPerson = '';
  poblationPerson = '';
  countryPerson = '';
  zone = '';
  telPerson = ''; // Obligatorio
  extPerson = '';
  emailPerson = ''; // Obligatorio
  webPage = '';

  //************************ DOMICILIO DE INSTALACION ************************

  calleInst = '';
  no_extInst = '';
  no_intInst = '';
  coloniaInst = '';
  cpInst = '';
  municipioInst = '';
  localInst = '';
  poblationInst = '';
  countryInst = '';
  zoneInst = '';
  telInst = '';
  extInst = '';

  //************************ INFORMACION DE FACTURACION **********************

  isFactu = false;
  nameFact = '';
  puestoFact = '';
  telFact = '';
  extFact = '';
  celFact = '';
  emailFact = '';
  aditionalData = '';

  //************************ INFORMACION COBRANZAS ***************************

  nameCobra = '';
  puestoCobra = '';
  telCobra = '';
  extCob = '';
  celCobra = ''; // Obligatorio
  emailCobra = ''; // Obligatorio

  //************************ INFORMACION BANCARIA ****************************

  no_count = '';
  no_clabe = '';

  //************************ CONTACTO DE SITIO *******************************

  ubicationSite = '';
  coordenadasSite = '';
  nameSite = '';
  telSite = '';
  celSite = '';
  depSite = '';
  timeSite = '';
  megasSite = '';
  noEnlace_sit = '';

  //************************ DATOS DEL VENDEDOR ******************************

  nameVen = '';
  oficinaVen = '';
  emailSelected: { id: number; email: string }[] = [];
  celVen = '';

  //************************ ARCHIVOS ****************************************

  fileBank: File | null = null;
  fileZip: File | null = null;
  fileINE: File | null = null;
  fileCEDU: File | null = null;
  fileCOMP: File | null = null;

  //************************ ESTADO DEL ENVIO ********************************

  /** ids de los campos con error, para marcarlos en rojo */
  invalidos = new Set<string>();
  enviando = false;
  errorEnvio = '';

  //************************ CATALOGOS ***************************************

  regimenes = [
    { id: 601, nombre: 'General de Ley Personas Morales' },
    { id: 603, nombre: 'Personas Morales con Fines no Lucrativos' },
    { id: 605, nombre: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
    { id: 606, nombre: 'Arrendamiento' },
    { id: 607, nombre: 'Régimen de Enajenación o Adquisición de Bienes' },
    { id: 608, nombre: 'Demás ingresos' },
    { id: 610, nombre: 'Residentes en el Extranjero sin Establecimiento Permanente en México' },
    { id: 611, nombre: 'Ingresos por Dividendos (socios y accionistas)' },
    { id: 612, nombre: 'Personas Físicas con Actividades Empresariales y Profesionales' },
    { id: 614, nombre: 'Ingresos por intereses' },
    { id: 615, nombre: 'Régimen de los ingresos por obtención de premios' },
    { id: 616, nombre: 'Sin obligaciones fiscales' },
    { id: 620, nombre: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
    { id: 621, nombre: 'Incorporación Fiscal' },
    { id: 622, nombre: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
    { id: 623, nombre: 'Opcional para Grupos de Sociedades' },
    { id: 624, nombre: 'Coordinados' },
    { id: 625, nombre: 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas' },
    { id: 626, nombre: 'Régimen Simplificado de Confianza' },
    { id: 627, nombre: 'Publico General' }
  ];

  use_cfdi = [
    { id: 1, codigo: 'G01', descripcion: 'Adquisición de mercancías.' },
    { id: 2, codigo: 'G02', descripcion: 'Devoluciones, descuentos o bonificaciones.' },
    { id: 3, codigo: 'G03', descripcion: 'Gastos en general.' },
    { id: 4, codigo: 'I01', descripcion: 'Construcciones.' },
    { id: 5, codigo: 'I02', descripcion: 'Mobiliario y equipo de oficina por inversiones.' },
    { id: 6, codigo: 'I03', descripcion: 'Equipo de transporte.' },
    { id: 7, codigo: 'I04', descripcion: 'Equipo de cómputo y accesorios.' },
    { id: 8, codigo: 'I05', descripcion: 'Dados, troqueles, moldes, matrices y herramental.' },
    { id: 9, codigo: 'I06', descripcion: 'Comunicaciones telefónicas.' },
    { id: 10, codigo: 'I07', descripcion: 'Comunicaciones satelitales.' },
    { id: 11, codigo: 'I08', descripcion: 'Otra maquinaria y equipo.' },
    { id: 12, codigo: 'D01', descripcion: 'Honorarios médicos, dentales y gastos hospitalarios.' },
    { id: 13, codigo: 'D02', descripcion: 'Gastos médicos por incapacidad o discapacidad.' },
    { id: 14, codigo: 'D03', descripcion: 'Gastos funerales.' },
    { id: 15, codigo: 'D04', descripcion: 'Donativos.' },
    { id: 16, codigo: 'D05', descripcion: 'Intereses reales efectivamente pagados por créditos hipotecarios (casa habitación).' },
    { id: 17, codigo: 'D06', descripcion: 'Aportaciones voluntarias al SAR.' },
    { id: 18, codigo: 'D07', descripcion: 'Primas por seguros de gastos médicos.' },
    { id: 19, codigo: 'D08', descripcion: 'Gastos de transportación escolar obligatoria.' },
    { id: 20, codigo: 'D09', descripcion: 'Depósitos en cuentas para el ahorro, primas que tengan como base planes de pensiones.' },
    { id: 21, codigo: 'D10', descripcion: 'Pagos por servicios educativos (colegiaturas).' },
    { id: 22, codigo: 'S01', descripcion: 'Sin efectos fiscales.' },
    { id: 23, codigo: 'CP01', descripcion: 'Pagos.' },
    { id: 24, codigo: 'CN01', descripcion: 'Nómina.' }
  ];

  emailsPdnt = [
    { id: 1, email: 'suemy.avila@elpoderdeinternet.mx' },
    { id: 2, email: 'carlos.escalona@elpoderdeinternet.mx' },
    { id: 3, email: 'diana.hernandez@elpoderdeinternet.mx' },
    { id: 4, email: 'deysimar.jimenez@elpoderdeinternet.mx' },
    { id: 5, email: 'administracion@elpoderdeinternet.mx' },
    { id: 6, email: 'ventas@elpoderdeinternet.mx' },
    { id: 7, email: 'jorge.ceron@elpoderdeinternet.mx' },
  ];

  wayPage = [
    { id: 1, codigo: '01', descripcion: 'Efectivo' },
    { id: 2, codigo: '02', descripcion: 'Cheque nominativo' },
    { id: 3, codigo: '03', descripcion: 'Transferencia electrónica de fondos' },
    { id: 4, codigo: '04', descripcion: 'Tarjeta de crédito' },
    { id: 5, codigo: '05', descripcion: 'Monedero electrónico' },
    { id: 6, codigo: '06', descripcion: 'Dinero electrónico' },
    { id: 7, codigo: '08', descripcion: 'Vales de despensa' },
    { id: 8, codigo: '12', descripcion: 'Dación en pago' },
    { id: 9, codigo: '13', descripcion: 'Pago por subrogación' },
    { id: 10, codigo: '14', descripcion: 'Pago por consignación' },
    { id: 11, codigo: '15', descripcion: 'Condonación' },
    { id: 12, codigo: '17', descripcion: 'Compensación' },
    { id: 13, codigo: '23', descripcion: 'Novación' },
    { id: 14, codigo: '24', descripcion: 'Confusión' },
    { id: 15, codigo: '25', descripcion: 'Remisión de deuda' },
    { id: 16, codigo: '26', descripcion: 'Prescripción o caducidad' },
    { id: 17, codigo: '27', descripcion: 'A satisfacción del acreedor' },
    { id: 18, codigo: '28', descripcion: 'Tarjeta de débito' },
    { id: 19, codigo: '29', descripcion: 'Tarjeta de servicios' },
    { id: 20, codigo: '30', descripcion: 'Aplicación de anticipos' },
    { id: 21, codigo: '31', descripcion: 'Intermediario pagos' },
    { id: 22, codigo: '99', descripcion: 'Por definir' }
  ];

  banks = [
    { id: 1, nombre: 'ABC Capital' },
    { id: 3, nombre: 'Banca Afirme' },
    { id: 4, nombre: 'Banca Mifel' },
    { id: 5, nombre: 'Banco Actinver' },
    { id: 6, nombre: 'Banco Ahorro Famsa' },
    { id: 7, nombre: 'Banco Autofin México' },
    { id: 8, nombre: 'Banco Azteca' },
    { id: 9, nombre: 'Banco Bancrea' },
    { id: 10, nombre: 'Banco Base' },
    { id: 11, nombre: 'Banco Compartamos' },
    { id: 12, nombre: 'Banco Credit Suisse (México)' },
    { id: 13, nombre: 'Banco del Bajio' },
    { id: 14, nombre: 'Banco Forjadores' },
    { id: 15, nombre: 'Banco Inbursa' },
    { id: 16, nombre: 'Banco Inmobiliario Mexicano' },
    { id: 17, nombre: 'Banco Interacciones' },
    { id: 18, nombre: 'Banco Invex' },
    { id: 19, nombre: 'Banco J.P. Morgan' },
    { id: 20, nombre: 'Banco Mercantil del Norte (Banorte)' },
    { id: 21, nombre: 'Banco Monex' },
    { id: 22, nombre: 'Banco Multiva' },
    { id: 23, nombre: 'Banco Nacional de México (Banamex)' },
    { id: 24, nombre: 'Banco Pagatodo' },
    { id: 25, nombre: 'Banco Regional de Monterrey' },
    { id: 26, nombre: 'Banco Santander (México)' },
    { id: 27, nombre: 'Banco Ve Por Mas' },
    { id: 28, nombre: 'Banco Wal-Mart de México' },
    { id: 29, nombre: 'Bancoppel' },
    { id: 30, nombre: 'Bank of America México' },
    { id: 31, nombre: 'Bank of Tokyo-Mitsubishi UFJ (México)' },
    { id: 32, nombre: 'Bankaool' },
    { id: 33, nombre: 'Bansi' },
    { id: 34, nombre: 'Barclays Bank México' },
    { id: 35, nombre: 'BBVA Bancomer' },
    { id: 36, nombre: 'CiBanco' },
    { id: 37, nombre: 'ConsuBanco' },
    { id: 38, nombre: 'Deutsche Bank México' },
    { id: 39, nombre: 'Fundación Donde Banco' },
    { id: 40, nombre: 'HSBC México' },
    { id: 41, nombre: 'Intercam Banco' },
    { id: 42, nombre: 'Investa Bank' },
    { id: 43, nombre: 'Scotiabank Inverlat' },
    { id: 44, nombre: 'UBS Bank México' },
    { id: 45, nombre: 'Volkswagen Bank' }
  ];

  local = [
    { id: 1, c_Estado: 'AGU', c_Pais: 'MEX', nombre: 'Aguascalientes' },
    { id: 2, c_Estado: 'BCN', c_Pais: 'MEX', nombre: 'Baja California' },
    { id: 3, c_Estado: 'BCS', c_Pais: 'MEX', nombre: 'Baja California Sur' },
    { id: 4, c_Estado: 'CAM', c_Pais: 'MEX', nombre: 'Campeche' },
    { id: 5, c_Estado: 'CHP', c_Pais: 'MEX', nombre: 'Chiapas' },
    { id: 6, c_Estado: 'CHH', c_Pais: 'MEX', nombre: 'Chihuahua' },
    { id: 7, c_Estado: 'COA', c_Pais: 'MEX', nombre: 'Coahuila' },
    { id: 8, c_Estado: 'COL', c_Pais: 'MEX', nombre: 'Colima' },
    { id: 9, c_Estado: 'CMX', c_Pais: 'MEX', nombre: 'Ciudad de México' },
    { id: 10, c_Estado: 'DUR', c_Pais: 'MEX', nombre: 'Durango' },
    { id: 11, c_Estado: 'GUA', c_Pais: 'MEX', nombre: 'Guanajuato' },
    { id: 12, c_Estado: 'GRO', c_Pais: 'MEX', nombre: 'Guerrero' },
    { id: 13, c_Estado: 'HID', c_Pais: 'MEX', nombre: 'Hidalgo' },
    { id: 14, c_Estado: 'JAL', c_Pais: 'MEX', nombre: 'Jalisco' },
    { id: 15, c_Estado: 'MEX', c_Pais: 'MEX', nombre: 'Estado de México' },
    { id: 16, c_Estado: 'MIC', c_Pais: 'MEX', nombre: 'Michoacán' },
    { id: 17, c_Estado: 'MOR', c_Pais: 'MEX', nombre: 'Morelos' },
    { id: 18, c_Estado: 'NAY', c_Pais: 'MEX', nombre: 'Nayarit' },
    { id: 19, c_Estado: 'NLE', c_Pais: 'MEX', nombre: 'Nuevo León' },
    { id: 20, c_Estado: 'OAX', c_Pais: 'MEX', nombre: 'Oaxaca' },
    { id: 21, c_Estado: 'PUE', c_Pais: 'MEX', nombre: 'Puebla' },
    { id: 22, c_Estado: 'QUE', c_Pais: 'MEX', nombre: 'Querétaro' },
    { id: 23, c_Estado: 'ROO', c_Pais: 'MEX', nombre: 'Quintana Roo' },
    { id: 24, c_Estado: 'SLP', c_Pais: 'MEX', nombre: 'San Luis Potosí' },
    { id: 25, c_Estado: 'SIN', c_Pais: 'MEX', nombre: 'Sinaloa' },
    { id: 26, c_Estado: 'SON', c_Pais: 'MEX', nombre: 'Sonora' },
    { id: 27, c_Estado: 'TAB', c_Pais: 'MEX', nombre: 'Tabasco' },
    { id: 28, c_Estado: 'TAM', c_Pais: 'MEX', nombre: 'Tamaulipas' },
    { id: 29, c_Estado: 'TLA', c_Pais: 'MEX', nombre: 'Tlaxcala' },
    { id: 30, c_Estado: 'VER', c_Pais: 'MEX', nombre: 'Veracruz' },
    { id: 31, c_Estado: 'YUC', c_Pais: 'MEX', nombre: 'Yucatán' },
    { id: 32, c_Estado: 'ZAC', c_Pais: 'MEX', nombre: 'Zacatecas' }
  ];

  translatedWayPage: any[] = [...this.wayPage];
  translatedCfdi: any[] = [...this.use_cfdi];
  translatedRegimenes: any[] = [...this.regimenes];

  /** El régimen 616 (sin obligaciones fiscales) se trata como persona física / casero */
  get esPersonaFisica(): boolean {
    return this.regimenSeleccionado?.id === 616;
  }

  private traducirCatalogos(): void {
    const tr = (texto: string) => this.transloco.translate(texto);
    this.translatedWayPage = this.wayPage.map((i) => ({ ...i, descripcion: tr(i.descripcion) }));
    this.translatedCfdi = this.use_cfdi.map((i) => ({ ...i, descripcion: tr(i.descripcion) }));
    this.translatedRegimenes = this.regimenes.map((i) => ({ ...i, nombre: tr(i.nombre) }));

    // Conserva lo elegido, ahora con el texto en el idioma nuevo
    const mismo = (lista: any[], actual: any) => (actual ? lista.find((i) => i.id === actual.id) ?? null : null);
    this.wayPageSelected = mismo(this.translatedWayPage, this.wayPageSelected);
    this.cfdiSelected = mismo(this.translatedCfdi, this.cfdiSelected);
    this.regimenSeleccionado = mismo(this.translatedRegimenes, this.regimenSeleccionado);
  }

  useDataPCobra(): void {
    this.nameCobra = this.rasonName;
    this.telCobra = this.telPerson;
    this.extCob = this.extPerson;
    this.celCobra = this.telPerson;
    this.emailCobra = this.emailPerson;
    this.invalidos.delete('celCob');
    this.invalidos.delete('correoCob');
    this.avisoSiVacio();
  }

  useDataPFactu(): void {
    this.nameFact = this.rasonName;
    this.telFact = this.telPerson;
    this.extFact = this.extPerson;
    this.celFact = this.telPerson;
    this.emailFact = this.emailPerson;
    this.invalidos.delete('correoFact');
    this.avisoSiVacio();
  }

  private avisoSiVacio(): void {
    if (!this.rasonName && !this.telPerson && !this.emailPerson) this.aviso('No hay datos');
  }

  onFileSelected(event: Event, tipo: 'bankFile' | 'zipFile' | 'INEFile' | 'CEDUFile' | 'COMPFile'): void {
    const archivo = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (tipo === 'bankFile') this.fileBank = archivo;
    if (tipo === 'zipFile') this.fileZip = archivo;
    if (tipo === 'INEFile') this.fileINE = archivo;
    if (tipo === 'CEDUFile') this.fileCEDU = archivo;
    if (tipo === 'COMPFile') this.fileCOMP = archivo;
    this.invalidos.delete(tipo);
  }

  /** Quita la marca roja en cuanto el usuario corrige el campo */
  limpiar(id: string): void {
    this.invalidos.delete(id);
  }

  //************************ VALIDACION **************************************

  private validar(): ErrorCampo[] {
    const errores: ErrorCampo[] = [];
    const correo = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const telefono = (v: string) => soloDigitos(v).length >= 10 && soloDigitos(v).length <= 15;
    const agregar = (id: string, mensaje: string) => errores.push({ id, mensaje });

    if (!txt(this.rasonName)) agregar('razonSocial', 'Escriba la razón social o el nombre.');
    if (!this.regimenSeleccionado) agregar('regimen', 'Seleccione un régimen fiscal.');
    if (txt(this.rfc) && !/^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/i.test(txt(this.rfc))) agregar('rfc', 'El RFC no tiene un formato válido.');
    if (txt(this.cpPerson) && !/^\d{5}$/.test(txt(this.cpPerson))) agregar('cp', 'El código postal debe tener 5 dígitos.');
    if (!telefono(this.telPerson)) agregar('telefono', 'El teléfono debe tener entre 10 y 15 dígitos.');
    if (!correo(this.emailPerson)) agregar('correo', 'Escriba un correo electrónico válido.');
    if (txt(this.cpInst) && !/^\d{5}$/.test(txt(this.cpInst))) agregar('cpInst', 'El código postal debe tener 5 dígitos.');
    if (this.isFactu && txt(this.emailFact) && !correo(this.emailFact)) agregar('correoFact', 'Escriba un correo electrónico válido.');
    if (!telefono(this.celCobra)) agregar('celCob', 'El celular debe tener entre 10 y 15 dígitos.');
    if (!correo(this.emailCobra)) agregar('correoCob', 'Escriba un correo electrónico válido.');
    if (txt(this.no_clabe) && soloDigitos(this.no_clabe).length !== 18) agregar('numClabe', 'La CLABE debe tener 18 dígitos.');

    if (this.fileBank) {
      if (!this.fileBank.name.toLowerCase().endsWith('.pdf')) agregar('bankFile', 'El archivo de Carátula debe ser PDF.');
      else if (this.fileBank.size > MAX_PDF_MB * MB) agregar('bankFile', 'La carátula no debe pasar de 10 MB.');
    }
    if (!this.esPersonaFisica && this.fileZip) {
      if (!this.fileZip.name.toLowerCase().endsWith('.zip')) agregar('zipFile', 'El archivo ZIP debe tener extensión .zip.');
      else if (this.fileZip.size > MAX_ZIP_MB * MB) agregar('zipFile', 'El ZIP no debe pasar de 50 MB.');
    }
    if (this.esPersonaFisica) {
      const permitido = /\.(pdf|png|jpe?g)$/i;
      for (const [id, archivo] of [['INEFile', this.fileINE], ['CEDUFile', this.fileCEDU], ['COMPFile', this.fileCOMP]] as const) {
        if (archivo && !permitido.test(archivo.name)) agregar(id, 'Use archivos PDF, PNG o JPG.');
      }
    }
    if (this.emailSelected.length === 0) agregar('correosVendedor', 'Seleccione al menos un correo.');

    return errores;
  }

  //************************ ENVIO *******************************************

  async submitAll(): Promise<void> {
    (document.activeElement as HTMLElement | null)?.blur();

    const errores = this.validar();
    this.invalidos = new Set(errores.map((e) => e.id));
    if (errores.length > 0) {
      const extra = errores.length > 1 ? ` (+${errores.length - 1})` : '';
      this.aviso(this.transloco.translate(errores[0].mensaje) + extra, 5000);
      const campo = document.getElementById(errores[0].id);
      campo?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => campo?.focus({ preventScroll: true }), 400);
      return;
    }

    await this.enviar();
  }

  /** También se usa para "Reintentar": no se pierde nada de lo capturado */
  async enviar(): Promise<void> {
    this.snackBar.dismiss(); // que no quede un aviso de validación viejo encima del panel o de la página de gracias
    this.enviando = true;
    this.errorEnvio = '';

    try {
      // Persona física: INE, cédula y comprobante se comprimen aquí en un ZIP
      const zip = this.esPersonaFisica ? await this.empaquetarDocumentos() : this.fileZip;
      if (zip && zip.size > MAX_ZIP_MB * MB) throw new Error('El ZIP no debe pasar de 50 MB.');

      const attachments = [];
      if (this.fileBank) {
        attachments.push({ filename: 'CaratulaBancariaCliente.pdf', content: await leerBase64(this.fileBank), encoding: 'base64' });
      }
      if (zip) {
        attachments.push({ filename: 'DocumentosComprimidos.zip', content: await leerBase64(zip), encoding: 'base64' });
      }

      const destinatarios = this.destinatarios();
      const variables = this.datosDelAlta();

      await axios.post(`${environment.apiUrl}/send-email`, {
        to: destinatarios.map((email, i) => ({ id: i + 1, email })),
        subject: 'ALTA DE CLIENTES',
        text: `¡Hola! te entrego el Alta de clientes: ${may(this.rasonName)} 😊👌 ➡️`,
        attachments,
        variables: [variables],
      });

      this.altaService.guardar({ cliente: txt(this.rasonName), vendedor: txt(this.nameVen), destinatarios, variables });
      await this.router.navigate(['/gratitude']);
    } catch (error: any) {
      console.error('Error al enviar el alta', error);
      this.errorEnvio = error?.response
        ? error.response.data?.message || `Error ${error.response.status}`
        : error?.message === 'Network Error'
          ? 'No hay conexión con el servidor. Revise su internet e intente de nuevo.'
          : error?.message || 'No se pudo enviar el formulario.';
    }
  }

  cerrarError(): void {
    this.enviando = false;
    this.errorEnvio = '';
  }

  /** Correos elegidos + el destinatario fijo, sin repetir (antes se duplicaba en cada reintento) */
  private destinatarios(): string[] {
    const correos = [...this.emailSelected.map((e) => e.email), DESTINATARIO_FIJO];
    return [...new Map(correos.map((c) => [c.toLowerCase(), c])).values()];
  }

  private async empaquetarDocumentos(): Promise<File | null> {
    const archivos = [this.fileINE, this.fileCEDU, this.fileCOMP].filter((a): a is File => !!a);
    if (archivos.length === 0) return null;

    const { default: JSZip } = await import('jszip'); // se carga solo cuando hay documentos que comprimir
    const zip = new JSZip();
    for (const archivo of archivos) zip.file(archivo.name, await archivo.arrayBuffer());
    const contenido = await zip.generateAsync({ type: 'blob' });
    return new File([contenido], 'archivo.zip', { type: 'application/zip' });
  }

  /** Mismo formato que espera el backend (y que se usa para la copia en PDF) */
  private datosDelAlta() {
    return {
      datos_fiscales: {
        razon_social: may(this.rasonName),
        regimen_fiscal: { id: this.regimenSeleccionado?.id ?? '', nombre: may(this.regimenSeleccionado?.nombre) },
        rfc: may(this.rfc),
        calle: may(this.callePerson),
        numero_interior: txt(this.no_intPerson),
        numero_exterior: txt(this.no_extPerson),
        colonia: may(this.coloniaPerson),
        codigo_postal: txt(this.cpPerson),
        municipio: may(this.municipioPerson),
        estado: may(this.localSelected?.nombre),
        poblacion: txt(this.poblationPerson),
        pais: may(this.countryPerson),
        zona: may(this.zone),
        telefono: txt(this.telPerson),
        extension: txt(this.extPerson),
        correo_electronico: txt(this.emailPerson),
        pagina_web: txt(this.webPage)
      },
      domicilio_instalacion: {
        calle: may(this.calleInst),
        numero_exterior: txt(this.no_extInst),
        numero_interior: txt(this.no_intInst),
        colonia: may(this.coloniaInst),
        codigo_postal: txt(this.cpInst),
        municipio: may(this.municipioInst),
        estado: may(this.localInst),
        poblacion: txt(this.poblationInst),
        pais: may(this.countryInst),
        zona: may(this.zoneInst),
        telefono: txt(this.telInst),
        extension: txt(this.extInst)
      },
      informacion_facturacion: {
        nombre_encargado: may(this.nameFact),
        puesto: may(this.puestoFact),
        telefono: txt(this.telFact),
        extension: txt(this.extFact),
        celular: txt(this.celFact),
        correo_electronico: txt(this.emailFact),
        cfdi: may(this.cfdiSelected?.descripcion),
        metodo_pago: may(this.wayPageSelected?.descripcion),
        datos_adicionales: may(this.aditionalData)
      },
      informacion_cobranza: {
        nombre_encargado: may(this.nameCobra),
        puesto: may(this.puestoCobra),
        telefono: txt(this.telCobra),
        extension: txt(this.extCob),
        celular: txt(this.celCobra),
        correo_electronico: txt(this.emailCobra)
      },
      informacion_bancaria: {
        numero_cuenta: txt(this.no_count),
        numero_cuenta_clabe: soloDigitos(this.no_clabe),
        banco: may(this.bankSelected?.nombre)
      },
      contacto_sitio: {
        ubicacion: may(this.ubicationSite),
        coordenadas: txt(this.coordenadasSite),
        nombre_contacto_sitio: txt(this.nameSite),
        telefono: txt(this.telSite),
        celular: txt(this.celSite),
        departamento: may(this.depSite),
        horario_atencion: txt(this.timeSite),
        megas_aproximados: txt(this.megasSite),
        numero_enlaces: txt(this.noEnlace_sit)
      },
      datos_vendedor: {
        nombre_vendedor: may(this.nameVen),
        oficina: may(this.oficinaVen),
        correos: this.emailSelected.map((e) => e.email).join(', '),
        celular_vendedor: txt(this.celVen)
      }
    };
  }

  private aviso(mensaje: string, duracion = 3000): void {
    this.snackBar.open(this.transloco.translate(mensaje), this.transloco.translate('Cerrar'), {
      duration: duracion,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    });
  }
}

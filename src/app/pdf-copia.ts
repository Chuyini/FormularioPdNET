const SECCIONES: [string, string][] = [
  ['datos_fiscales', 'Datos Fiscales'],
  ['domicilio_instalacion', 'Domicilio de Instalación'],
  ['informacion_facturacion', 'Información de Facturación'],
  ['informacion_cobranza', 'Información de Cobranza'],
  ['informacion_bancaria', 'Información Bancaria'],
  ['contacto_sitio', 'Contacto de Sitio'],
  ['datos_vendedor', 'Datos del Vendedor'],
];

/** "numero_cuenta_clabe" -> "Numero cuenta clabe" */
const etiqueta = (llave: string) => {
  const texto = llave.replace(/_/g, ' ');
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

const valor = (v: unknown): string => {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object') return (v as any).nombre ?? (v as any).descripcion ?? '';
  return String(v);
};

/**
 * Copia del alta para el cliente, con salto de página automático (antes se cortaba en la primera hoja).
 * jsPDF se carga solo al pedir la copia, para que el formulario abra más rápido.
 */
export async function descargarCopiaPdf(variables: Record<string, any>, cliente: string): Promise<void> {
  const { default: jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'letter' });
  const margen = 15;
  const ancho = doc.internal.pageSize.getWidth() - margen * 2;
  const alto = doc.internal.pageSize.getHeight();
  let y = margen;

  const espacio = (necesario: number) => {
    if (y + necesario > alto - margen) {
      doc.addPage();
      y = margen;
    }
  };

  doc.setFont('helvetica', 'bold').setFontSize(16);
  doc.text('ALTA DE CLIENTES - EL PODER DE INTERNET', margen, y);
  y += 8;
  doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(110);
  doc.text(`${cliente} · ${new Date().toLocaleString('es-MX')}`, margen, y);
  doc.setTextColor(0);
  y += 10;

  for (const [llave, titulo] of SECCIONES) {
    const datos = variables[llave];
    if (!datos) continue;

    espacio(14);
    doc.setFont('helvetica', 'bold').setFontSize(12).setTextColor(0, 91, 187);
    doc.text(titulo, margen, y);
    doc.setTextColor(0);
    y += 7;

    doc.setFontSize(10);
    for (const [campo, v] of Object.entries(datos)) {
      const texto = valor(v);
      if (!texto) continue;
      const lineas = doc.splitTextToSize(`${etiqueta(campo)}: ${texto}`, ancho);
      espacio(lineas.length * 5);
      doc.setFont('helvetica', 'normal');
      doc.text(lineas, margen, y);
      y += lineas.length * 5;
    }
    y += 4;
  }

  const nombre = cliente.replace(/[^\p{L}\p{N} ]/gu, '').trim().slice(0, 40) || 'Cliente';
  doc.save(`Alta_Pdnt_${nombre}.pdf`);
}

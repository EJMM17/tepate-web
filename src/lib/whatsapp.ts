import { COMPANY } from '@/data/navigation';

const DEFAULT_MESSAGE = `Hola, quiero solicitar una cotización para un proyecto de señalamiento vial.

Tipo de proyecto:
Ubicación:
Volumen estimado:
Fecha tentativa:
Empresa/dependencia:`;

export function buildWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  return `https://wa.me/${COMPANY.phoneWhatsapp}?text=${encodeURIComponent(message)}`;
}

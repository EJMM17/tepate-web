import type { APIRoute } from 'astro';

const required = ['name', 'projectType', 'message'] as const;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') return new Response(JSON.stringify({ ok: false, error: 'Solicitud inválida.' }), { status: 400 });
  const data = body as Record<string, string>;
  if (data.companyWebsite) return new Response(JSON.stringify({ ok: true }), { status: 200 });
  for (const key of required) if (!data[key]?.trim()) return new Response(JSON.stringify({ ok: false, error: 'Faltan campos obligatorios.' }), { status: 400 });
  if (!data.phone?.trim() && !data.email?.trim()) return new Response(JSON.stringify({ ok: false, error: 'Proporciona teléfono o correo.' }), { status: 400 });

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return new Response(JSON.stringify({ ok: false, error: 'Falta configurar RESEND_API_KEY, CONTACT_TO_EMAIL o CONTACT_FROM_EMAIL.' }), { status: 500 });
  }

  const text = `Nueva solicitud de cotización B2B\n\nNombre: ${data.name || ''}\nTeléfono: ${data.phone || ''}\nEmail: ${data.email || ''}\nEmpresa/dependencia: ${data.company || ''}\nEstado/Ciudad: ${data.location || ''}\nTipo de proyecto: ${data.projectType || ''}\nVolumen estimado: ${data.estimatedVolume || ''}\nFecha tentativa: ${data.tentativeDate || ''}\nLicitación: ${data.tender || ''}\n\nMensaje:\n${data.message || ''}`;

  const resend = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject: `Cotización B2B: ${data.projectType} - ${data.name}`, text }),
  });

  if (!resend.ok) return new Response(JSON.stringify({ ok: false, error: 'No se pudo enviar el correo en este momento.' }), { status: 502 });
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

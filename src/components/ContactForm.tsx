import { useState, type ChangeEvent, type FormEvent } from 'react';

interface FormState { name:string; phone:string; email:string; company:string; location:string; projectType:string; estimatedVolume:string; tentativeDate:string; tender:string; message:string; companyWebsite:string }
interface FormErrors { name?:string; phoneOrEmail?:string; projectType?:string; message?:string }
const INITIAL: FormState = { name:'', phone:'', email:'', company:'', location:'', projectType:'', estimatedVolume:'', tentativeDate:'', tender:'', message:'', companyWebsite:'' };

export default function ContactForm(): JSX.Element {
  const [state,setState]=useState(INITIAL); const [errors,setErrors]=useState<FormErrors>({});
  const [status,setStatus]=useState<'idle'|'submitting'|'success'|'error'>('idle'); const [serverError,setServerError]=useState('');
  const onChange=(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>setState(p=>({...p,[e.target.name]:e.target.value}));
  const onSubmit=async (e:FormEvent)=>{e.preventDefault(); const v:FormErrors={}; if(!state.name.trim())v.name='Nombre requerido'; if(!state.phone.trim()&&!state.email.trim())v.phoneOrEmail='Teléfono o correo requerido'; if(!state.projectType.trim())v.projectType='Selecciona proyecto'; if(!state.message.trim())v.message='Mensaje requerido'; setErrors(v); if(Object.keys(v).length)return; setStatus('submitting'); setServerError('');
  const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)}).catch(()=>null);
  if(res?.ok){setStatus('success'); setState(INITIAL);} else {setStatus('error'); setServerError(((await res?.json().catch(()=>null))?.error)||'Error al enviar.');}};

  return <form onSubmit={onSubmit} noValidate className="bg-[#121212] border border-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col gap-4" aria-label="Formulario de cotización TEPATE">
    <input type="text" name="companyWebsite" value={state.companyWebsite} onChange={onChange} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    {['name','phone','email','company','location','estimatedVolume','tentativeDate'].map((k)=> <input key={k} name={k} value={(state as any)[k]} onChange={onChange} placeholder={k} className="w-full bg-[#0A0A0A] border border-gray-800 text-gray-100 rounded-md px-4 py-3" aria-invalid={k==='name'&&!!errors.name} />)}
    <select name="projectType" value={state.projectType} onChange={onChange} className="w-full bg-[#0A0A0A] border border-gray-800 text-gray-100 rounded-md px-4 py-3" aria-invalid={!!errors.projectType}><option value="">Tipo de proyecto *</option><option>Calderas termoplásticas</option><option>Máquinas aplicadoras</option><option>Señalamiento horizontal</option><option>Señalamiento vertical</option><option>Dispositivos de confinamiento</option><option>Equipos solares viales</option></select>
    <select name="tender" value={state.tender} onChange={onChange} className="w-full bg-[#0A0A0A] border border-gray-800 text-gray-100 rounded-md px-4 py-3"><option value="">¿Licitación?</option><option>Sí</option><option>No</option></select>
    <textarea name="message" value={state.message} onChange={onChange} className="w-full bg-[#0A0A0A] border border-gray-800 text-gray-100 rounded-md px-4 py-3 min-h-[120px]" placeholder="Mensaje *" aria-invalid={!!errors.message} />
    {(errors.name||errors.phoneOrEmail||errors.projectType||errors.message)&&<p role="alert" className="text-xs text-red-400">{errors.name||errors.phoneOrEmail||errors.projectType||errors.message}</p>}
    <button type="submit" disabled={status==='submitting'} className="btn-primary w-full disabled:opacity-60">{status==='submitting'?'ENVIANDO…':'SOLICITAR COTIZACIÓN FORMAL'}</button>
    {status==='success' && <p role="status" className="text-sm text-yellow-400">Solicitud enviada correctamente.</p>}
    {status==='error' && <p role="alert" className="text-sm text-red-400">{serverError}</p>}
  </form>;
}

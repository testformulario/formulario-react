
import React, { useState } from 'react';
import { initialFormData } from '../constants';
import { FormData, YesNoNull } from '../types';
import { Input } from './common/Input';
import { Textarea } from './common/Textarea';
import { RadioGroup } from './common/RadioGroup';
import { ProgressBar } from './ProgressBar';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { UsersIcon } from './icons/UsersIcon';
import { ScaleIcon } from './icons/ScaleIcon';

const STEPS = [
    { number: 1, title: 'Datos del Trabajador', icon: UserCircleIcon },
    { number: 2, title: 'Detalles del Servicio', icon: DocumentTextIcon },
    { number: 3, title: 'Impacto en Jornada', icon: ExclamationTriangleIcon },
    { number: 4, title: 'Seguridad y Riesgos', icon: ShieldCheckIcon },
    { number: 5, title: 'Coordinador y Patrones', icon: UsersIcon },
    { number: 6, title: 'Acción Legal', icon: ScaleIcon },
];

export const FormB: React.FC = () => {
  const [formData, setFormData] = useState<Omit<FormData, 'id' | 'submissionTimestamp'>>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, serviceType: { ...prev.serviceType, [name]: checked }}));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: value as YesNoNull}));
  };

  const handleServiceTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setFormData(prev => ({ ...prev, serviceType: {...prev.serviceType, otherText: value}}))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const safeWorkerName = formData.workerName.replace(/\s/g, '_') || 'sin_nombre';
    const safeEmployeeId = formData.employeeId || 'sin_id';

    const newSubmission: FormData = {
        ...formData,
        id: `${safeEmployeeId}-${safeWorkerName}-${Date.now()}`,
        submissionTimestamp: new Date().toISOString(),
    };

    const existingSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]') as FormData[];
    const updatedSubmissions = [...existingSubmissions, newSubmission];
    localStorage.setItem('formSubmissions', JSON.stringify(updatedSubmissions));
    
    console.log('Formulario B Enviado y guardado:', newSubmission);
    setSubmitted(true);
  };
  
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const CurrentIcon = STEPS[currentStep - 1].icon;

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl text-center transition-all duration-500 ease-in-out transform scale-100">
        <h2 className="text-2xl font-bold text-green-600">¡Registro Guardado!</h2>
        <p className="mt-4 text-slate-600">Gracias por documentar el incidente. Su información ha sido guardada en este dispositivo.</p>
        <button
          onClick={() => {
            setFormData(initialFormData);
            setSubmitted(false);
            setCurrentStep(1);
          }}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Crear Nuevo Registro
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
      <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} />
      <div className="mt-6 border-b border-slate-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
            <CurrentIcon className="w-8 h-8 text-indigo-600"/>
            <div>
                <p className="text-sm text-indigo-600 font-semibold">Paso {currentStep} de {STEPS.length}</p>
                <h2 className="text-xl font-bold text-slate-900">{STEPS[currentStep-1].title}</h2>
            </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <Input label="Nombre" name="workerName" value={formData.workerName} onChange={handleChange} containerClassName="sm:col-span-3" required />
              <Input label="Nº Empleado" name="employeeId" value={formData.employeeId} onChange={handleChange} containerClassName="sm:col-span-3" required />
              <Input label="Fecha del incidente" name="incidentDate" type="date" value={formData.incidentDate} onChange={handleChange} containerClassName="sm:col-span-2" />
              <Input label="Hora inicio jornada" name="shiftStartTime" type="time" value={formData.shiftStartTime} onChange={handleChange} containerClassName="sm:col-span-2" />
              <Input label="Hora prevista finalización" name="shiftEndTime" type="time" value={formData.shiftEndTime} onChange={handleChange} containerClassName="sm:col-span-2" />
            </div>
          )}

          {currentStep === 2 && (
             <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                 <Input label="Ubicación al recibir servicio (Dirección)" name="locationOnReceipt" value={formData.locationOnReceipt} onChange={handleChange} containerClassName="sm:col-span-6" />
                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium leading-6 text-slate-700">Tipo de servicio</label>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-x-2"><input id="hospitalDischargeB" name="hospitalDischarge" type="checkbox" checked={formData.serviceType.hospitalDischarge} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/><label htmlFor="hospitalDischargeB" className="text-sm text-slate-900">Alta hospitalaria</label></div>
                        <div className="flex items-center gap-x-2"><input id="nonUrgentTransferB" name="nonUrgentTransfer" type="checkbox" checked={formData.serviceType.nonUrgentTransfer} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/><label htmlFor="nonUrgentTransferB" className="text-sm text-slate-900">Traslado no urgente</label></div>
                        <div className="flex items-center gap-x-2"><input id="otherB" name="other" type="checkbox" checked={formData.serviceType.other} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"/><label htmlFor="otherB" className="text-sm text-slate-900">Otro:</label><input type="text" value={formData.serviceType.otherText} onChange={handleServiceTextChange} disabled={!formData.serviceType.other} className="block w-40 rounded-md border-0 py-1.5 px-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed"/></div>
                    </div>
                </div>
                <Input label="Hora asignación" name="assignmentTime" type="time" value={formData.assignmentTime} onChange={handleChange} containerClassName="sm:col-span-3" />
                <Input label="Tiempo restante jornada (minutos)" name="remainingShiftTime" type="number" value={formData.remainingShiftTime} onChange={handleChange} containerClassName="sm:col-span-3" />
                <Textarea label="Complicaciones en la ejecución" name="complications" placeholder="Detallar complicaciones..." value={formData.complications} onChange={handleChange} containerClassName="sm:col-span-6" />
             </div>
          )}

          {currentStep === 3 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <RadioGroup label="¿Excede tiempo restante de jornada?" name="exceedsRemainingTime" value={formData.exceedsRemainingTime} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <RadioGroup label="¿Complicaciones imprevistas?" name="unforeseenComplications" value={formData.unforeseenComplications} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <RadioGroup label="¿Afectó vida personal?" name="affectedPersonalLife" value={formData.affectedPersonalLife} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <RadioGroup label="¿Exceso > 1 hora?" name="exceededOverOneHour" value={formData.exceededOverOneHour} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <Input label="Exceso total en minutos" name="excessMinutes" type="number" value={formData.excessMinutes} onChange={handleChange} containerClassName="sm:col-span-6" />
                <Textarea label="Explicación del impacto" name="impactExplanation" placeholder="Describa cómo le afectó este servicio..." value={formData.impactExplanation} onChange={handleChange} containerClassName="sm:col-span-6" />
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <RadioGroup label="¿Se generó un peligro o riesgo vial por conducir bajo estrés?" name="generatedRoadRisk" value={formData.generatedRoadRisk} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <Input label="Horas adicionales trabajadas" name="additionalHoursWorked" type="number" value={formData.additionalHoursWorked} onChange={handleChange} containerClassName="sm:col-span-3" />
                <Textarea label="Detallar riesgo" name="riskDetails" placeholder="Describa la situación de riesgo generada" value={formData.riskDetails} onChange={handleChange} containerClassName="sm:col-span-6" />
            </div>
          )}

          {currentStep === 5 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                <Input label="Coordinador que asignó el servicio" name="coordinatorName" value={formData.coordinatorName} onChange={handleChange} containerClassName="sm:col-span-3" />
                <Input label="Veces que ha ocurrido en los últimos 30 días" name="timesLast30Days" type="number" value={formData.timesLast30Days} onChange={handleChange} containerClassName="sm:col-span-3" />
                <RadioGroup label="¿Cree que existe un patrón de asignación?" name="assignmentPattern" value={formData.assignmentPattern} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <RadioGroup label="¿Cree que hubo intencionalidad personal?" name="personalIntent" value={formData.personalIntent} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <Textarea label="Descripción del patrón o comportamiento" name="patternDescription" placeholder="Si observa un patrón, descríbalo." value={formData.patternDescription} onChange={handleChange} containerClassName="sm:col-span-6" />
            </div>
          )}

          {currentStep === 6 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                 <RadioGroup label="¿Desea registrar este evento para futuras acciones legales?" name="registerForLegalAction" value={formData.registerForLegalAction} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
                <RadioGroup label="¿Desea que se notifique a Inspección de Trabajo?" name="notifyLaborInspectorate" value={formData.notifyLaborInspectorate} onChange={handleRadioChange} containerClassName="sm:col-span-3"/>
            </div>
          )}
        </div>

        <div className="mt-8 pt-5 border-t border-slate-200 flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Atrás
            </button>
            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors"
              >
                Guardar Registro
              </button>
            )}
        </div>
      </form>
    </div>
  );
};

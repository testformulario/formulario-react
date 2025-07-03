
import React, { useState, useEffect } from 'react';
import { FormData } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ArrowRightOnRectangleIcon } from './icons/ArrowRightOnRectangleIcon';

interface AdminPageProps {
  onBack: () => void;
  onLogout: () => void;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) return null;
    return (
        <div>
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="mt-1 text-sm text-slate-900">{String(value)}</dd>
        </div>
    );
};

export const AdminPage: React.FC<AdminPageProps> = ({ onBack, onLogout }) => {
  const [submissions, setSubmissions] = useState<FormData[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const storedSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]') as FormData[];
    storedSubmissions.sort((a, b) => new Date(b.submissionTimestamp).getTime() - new Date(a.submissionTimestamp).getTime());
    setSubmissions(storedSubmissions);
  }, []);
  
  const handleClearAll = () => {
    if (window.confirm('¿Está seguro de que desea eliminar TODOS los registros? Esta acción no se puede deshacer.')) {
        localStorage.removeItem('formSubmissions');
        setSubmissions([]);
    }
  }

  const handleToggleExpand = (id: string) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 pb-4 mb-6">
            <div>
                 <h2 className="text-xl font-bold text-slate-900">Registros Guardados</h2>
                 <p className="text-sm text-slate-500">{submissions.length} registro(s) encontrado(s).</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={onBack} className="px-3 py-2 text-sm sm:px-4 sm:py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
                    Volver
                </button>
                <button onClick={handleClearAll} disabled={submissions.length === 0} className="flex items-center gap-2 px-3 py-2 text-sm sm:px-4 sm:py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors">
                    <TrashIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Limpiar Todo</span>
                </button>
                <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 text-sm sm:px-4 sm:py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-700 transition-colors">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
            </div>
        </div>

        {submissions.length === 0 ? (
            <p className="text-center text-slate-500 py-10">No hay ningún registro guardado todavía.</p>
        ) : (
            <div className="space-y-4">
                {submissions.map((sub) => (
                    <div key={sub.id} className="border border-slate-200 rounded-lg">
                        <button onClick={() => handleToggleExpand(sub.id)} className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50">
                            <div>
                                <p className="font-semibold text-indigo-700">{sub.workerName || 'Sin Nombre'}</p>
                                <p className="text-sm text-slate-600">Fecha del Incidente: {sub.incidentDate || 'N/A'} | Guardado: {formatDate(sub.submissionTimestamp)}</p>
                            </div>
                            <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform ${expandedId === sub.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedId === sub.id && (
                            <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                                    <DetailItem label="Nº Empleado" value={sub.employeeId} />
                                    <DetailItem label="Inicio Jornada" value={sub.shiftStartTime} />
                                    <DetailItem label="Fin Previsto Jornada" value={sub.shiftEndTime} />
                                    <DetailItem label="Ubicación al Recibir" value={sub.locationOnReceipt} />
                                    <DetailItem label="Hora Asignación" value={sub.assignmentTime} />
                                    <DetailItem label="Minutos Restantes" value={sub.remainingShiftTime} />
                                    <DetailItem label="Exceso en Minutos" value={sub.excessMinutes} />
                                    <DetailItem label="Horas Extra" value={sub.additionalHoursWorked} />
                                    <DetailItem label="Coordinador" value={sub.coordinatorName} />
                                    <DetailItem label="Veces en 30 días" value={sub.timesLast30Days} />
                                    <DetailItem label="¿Afectó vida personal?" value={sub.affectedPersonalLife} />
                                    <DetailItem label="¿Riesgo vial generado?" value={sub.generatedRoadRisk} />
                                    <DetailItem label="¿Patrón de asignación?" value={sub.assignmentPattern} />
                                    <DetailItem label="¿Intencionalidad?" value={sub.personalIntent} />
                                    <DetailItem label="¿Acciones legales?" value={sub.registerForLegalAction} />
                                    <DetailItem label="¿Notificar Inspección?" value={sub.notifyLaborInspectorate} />
                                    <div className="sm:col-span-3">
                                        <DetailItem label="Complicaciones" value={sub.complications} />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <DetailItem label="Explicación Impacto" value={sub.impactExplanation} />
                                    </div>
                                     <div className="sm:col-span-3">
                                        <DetailItem label="Descripción Patrón" value={sub.patternDescription} />
                                    </div>
                                </dl>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};

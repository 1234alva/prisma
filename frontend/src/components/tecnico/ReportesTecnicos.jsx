import React from 'react';
import { BarChart3, TrendingUp, Zap, Box, Calendar, ChevronDown } from 'lucide-react';

export const ReportesTecnicos = () => {
  return (
    <div className="space-y-8">
      {/* HEADER DE REPORTES */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-jh7_dark uppercase tracking-tighter">Reporte de Rendimiento</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Estadísticas mensuales del técnico</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase transition-all hover:bg-slate-200">
          <Calendar size={14} /> Este Mes <ChevronDown size={14} />
        </button>
      </div>

      {/* TARJETAS DE MÉTRICAS CLAVE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="p-3 bg-blue-50 text-blue-500 w-fit rounded-2xl mb-4">
            <Zap size={20} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Efectividad</p>
          <p className="text-3xl font-black text-jh7_dark">94%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '94%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="p-3 bg-green-50 text-green-500 w-fit rounded-2xl mb-4">
            <TrendingUp size={20} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metros Instalados</p>
          <p className="text-3xl font-black text-jh7_dark">1,240m</p>
          <p className="text-[9px] text-green-600 font-bold mt-2">+12% respecto al mes anterior</p>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="p-3 bg-jh7_red/10 text-jh7_red w-fit rounded-2xl mb-4">
            <BarChart3 size={20} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Instalaciones Exitosas</p>
          <p className="text-3xl font-black text-jh7_dark">45</p>
          <p className="text-[9px] text-gray-400 font-bold mt-2">Objetivo mensual: 50</p>
        </div>
      </div>

      {/* DESGLOSE DE MATERIALES USADOS */}
      <div className="bg-jh7_dark p-8 rounded-[3rem] text-white shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/10 rounded-2xl"><Box size={20} className="text-jh7_red" /></div>
          <h3 className="font-black uppercase text-sm tracking-widest">Consumo Acumulado de Materiales</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 border border-white/10 rounded-3xl bg-white/5">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Cable Drop</p>
            <p className="text-xl font-black">850m</p>
          </div>
          <div className="p-4 border border-white/10 rounded-3xl bg-white/5">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Conectores</p>
            <p className="text-xl font-black">92</p>
          </div>
          <div className="p-4 border border-white/10 rounded-3xl bg-white/5">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Tensores</p>
            <p className="text-xl font-black">48</p>
          </div>
          <div className="p-4 border border-white/10 rounded-3xl bg-white/5">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Rosetas</p>
            <p className="text-xl font-black">45</p>
          </div>
        </div>
      </div>
    </div>
  );
};
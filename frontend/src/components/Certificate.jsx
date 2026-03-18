import React, { forwardRef } from 'react';
import { BrainCircuit, Award, ShieldCheck, Calendar, Trophy } from 'lucide-react';

const Certificate = forwardRef(({ userName, topic, difficulty, score, date }, ref) => {
  return (
    <div 
      ref={ref}
      className="certificate-container bg-white p-12 border-[20px] border-double border-indigo-900 shadow-2xl relative overflow-hidden"
      style={{ width: '842px', height: '595px', fontStyle: 'serif' }}
    >
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-8 border-l-8 border-indigo-900 opacity-20"></div>
      <div className="absolute top-0 right-0 w-32 h-32 border-t-8 border-r-8 border-indigo-900 opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b-8 border-l-8 border-indigo-900 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-8 border-r-8 border-indigo-900 opacity-20"></div>
      
      {/* Background Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4]">
        <BrainCircuit size={100} className="text-indigo-900" />
      </div>

      <div className="flex flex-col items-center text-center h-full justify-between">
        {/* Header */}
        <div className="flex flex-col items-center">
          <div className="bg-indigo-900 p-4 rounded-full mb-4 shadow-lg">
            <Trophy className="h-12 w-12 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-black text-indigo-950 tracking-widest uppercase mb-1">Certificate of Excellence</h1>
          <div className="h-1 w-64 bg-indigo-900 rounded-full mb-6"></div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <p className="text-xl text-gray-600 italic">This is to officially recognize that</p>
          <h2 className="text-5xl font-black text-indigo-900 tracking-tight underline dec-indigo-200">
            {userName || 'VALUED CANDIDATE'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            has successfully completed an AI-powered technical evaluation session for the domain of
          </p>
          <div className="text-3xl font-bold bg-indigo-50 px-8 py-3 rounded-xl border border-indigo-100 text-indigo-900">
            {topic} — {difficulty} Level
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex items-end justify-between mt-8 border-t-2 border-dashed border-indigo-100 pt-8 px-8">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-black text-green-600 mb-1">{score}%</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Performance Score</div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="bg-indigo-900/10 px-6 py-2 rounded-lg mb-2">
                 <ShieldCheck className="h-8 w-8 text-indigo-900" />
             </div>
             <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">Authenticated by</p>
             <p className="text-sm font-black text-indigo-950">SmartPrep AI Engine</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-900 font-bold mb-1">{date || new Date().toLocaleDateString()}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Evaluation Date</div>
          </div>
        </div>
      </div>
    </div>
  );
});

Certificate.displayName = 'Certificate';

export default Certificate;

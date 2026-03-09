'use client';

import React, { useState } from 'react';

export default function QuizLEVX() {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({ name: '', company: '' });
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);

  const questions = [
    { q: "¿Qué tan automatizado está tu proceso de captación de leads?", options: [{t:"Dependo de referidos o manual", s:0}, {t:"Tengo campañas pero califico manual", s:10}, {t:"Proceso 100% automatizado", s:20}] },
    { q: "¿Utilizas un CRM para gestionar el cierre y follow-up?", options: [{t:"No utilizo CRM", s:0}, {t:"Lo tengo pero no lo exploto", s:10}, {t:"Es el corazón de mi operación", s:20}] },
    { q: "¿Cuentas con guiones de venta estructurados (Straight Line)?", options: [{t:"Venta intuitiva", s:0}, {t:"Tengo algunas bases", s:10}, {t:"Metodología aplicada y medida", s:20}] },
    { q: "¿Mides el Costo de Adquisición (CAC) y el ROI?", options: [{t:"No lo mido", s:0}, {t:"Tengo una idea vaga", s:10}, {t:"Métricas exactas en dashboard", s:20}] },
    { q: "¿Tu infraestructura permite duplicar las ventas hoy?", options: [{t:"Colapsaría de inmediato", s:0}, {t:"Podría con esfuerzo manual", s:10}, {t:"Infraestructura escalable lista", s:20}] }
  ];

  const handleStart = () => {
    if (!userData.name || !userData.company) return alert("Por favor completa los datos.");
    setStep(2);
  };

  const handleAnswer = (s: number) => {
    const nextScore = score + s;
    setScore(nextScore);
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setStep(3);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, #1e1b4b, #0f172a)', color: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', width: '100%', background: 'rgba(30, 41, 59, 0.7)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
        
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>LEVX Intelligence</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Diagnóstico de Madurez y Escalabilidad Digital</p>
            <input style={{ width: '100%', padding: '14px', marginBottom: '15px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} placeholder="Tu Nombre" onChange={(e) => setUserData({...userData, name: e.target.value})} />
            <input style={{ width: '100%', padding: '14px', marginBottom: '25px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} placeholder="Tu Empresa" onChange={(e) => setUserData({...userData, company: e.target.value})} />
            <button style={{ width: '100%', padding: '16px', background: '#6366f1', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }} onClick={handleStart}>Iniciar Diagnóstico</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ width: '100%', height: '6px', background: '#334155', borderRadius: '10px', marginBottom: '20px' }}>
              <div style={{ width: `${(currentIdx / questions.length) * 100}%`, height: '100%', background: '#6366f1', transition: '0.3s' }}></div>
            </div>
            <h2 style={{ marginBottom: '25px' }}>{questions[currentIdx].q}</h2>
            {questions[currentIdx].options.map((opt, i) => (
              <button key={i} style={{ width: '100%', padding: '15px', marginBottom: '10px', background: 'rgba(51,65,85,0.5)', color: 'white', border: '1px solid #334155', borderRadius: '12px', textAlign: 'left', cursor: 'pointer' }} onClick={() => handleAnswer(opt.s)}>
                {opt.t}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ color: '#818cf8' }}>Análisis Finalizado</h2>
            <p style={{ color: '#94a3b8' }}>{userData.name} | {userData.company}</p>
            <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#6366f1', margin: '20px 0' }}>{score}%</div>
            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #6366f1', textAlign: 'left' }}>
              <strong>{score > 70 ? "ESTRUCTURA ÉLITE" : score > 40 ? "POTENCIAL DE ESCALA" : "RIESGO OPERATIVO"}</strong>
              <p style={{ marginTop: '10px' }}>{score > 70 ? "Tu sistema es sólido. El siguiente paso es optimización avanzada de conversiones." : "Bases presentes, pero falta automatización para no depender del dueño."}</p>
            </div>
            <button style={{ width: '100%', padding: '16px', background: '#10b981', color: 'white', borderRadius: '12px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginTop: '20px' }} onClick={() => window.print()}>Guardar Reporte</button>
          </div>
        )}
      </div>
    </div>
  );
}

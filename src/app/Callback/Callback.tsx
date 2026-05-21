import React, { useEffect, useState } from 'react';

const Callback: React.FC = () => {
  const [errorLog, setErrorLog] = useState<string | null>(null);

  useEffect(() => {
    console.log("--- INICIANDO EXTRACCIÓN DE TOKEN TAPIS ---");
    
    // 1. Extraer token de forma segura (Soporta tanto ?access_token como #access_token)
    const url = window.location.href;
    let token: string | null = null;

    if (url.includes('access_token=')) {
      const match = url.match(/access_token=([^&]*)/);
      token = match ? match[1] : null;
    }

    // Recuperar el origen de desarrollo si existe
    const savedOrigin = sessionStorage.getItem('oauth_original_origin');
    const currentOrigin = window.location.origin;

    if (token) {
      console.log("Token extraído con éxito.");

      // CASO A: Venimos de localhost pero TACC nos regresó al Pod de producción
      if (savedOrigin && savedOrigin !== currentOrigin) {
        console.log(`Redirigiendo al entorno local de desarrollo: ${savedOrigin}`);
        sessionStorage.removeItem('oauth_original_origin');
        
        // Pasamos el token de vuelta a tu localhost
        window.location.href = `${savedOrigin}/callback?access_token=${token}`;
        return;
      }

      // CASO B: Ya estamos en el entorno correcto (Local o Producción)
      try {
        // Guardamos en LocalStorage.
        localStorage.setItem('tapis-token', token);
        localStorage.setItem('token', token);

        console.log("¡Token guardado con éxito! Hemos congelado la redirección para que revises.");
        
        // Limpiamos la bandera del origen de sesión
        sessionStorage.removeItem('oauth_original_origin');

        // COMENTAMOS EL REDIRECCIONAMIENTO AUTOMÁTICO PARA DEBUGGEAR
        // setTimeout(() => { window.location.href = '/'; }, 300);

      } catch (error: any) {
        console.error("Error al guardar las credenciales:", error);
        setErrorLog(`Error al guardar en almacenamiento local: ${error.message || error}`);
      }

    } else {
      console.error("No se encontró el parámetro access_token en la URL:", url);
      setErrorLog("La respuesta de TACC no contenía un token válido. Revisa los logs de la consola.");
    }
  }, []);

  if (errorLog) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7f1d1d', color: '#fff', fontFamily: 'sans-serif', padding: '2rem' }}>
        <div style={{ background: '#991b1b', padding: '2rem', borderRadius: '0.5rem', maxWidth: '500px' }}>
          <h3 style={{ marginTop: 0 }}>⚠️ Error de Autenticación</h3>
          <p>{errorLog}</p>
          <button onClick={() => window.location.href = '/login'} style={{ background: '#fff', color: '#991b1b', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: 'bold' }}>
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#111827', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '2.5rem', background: '#1f2937', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', maxWidth: '400px', width: '90%' }}>
        <div style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid #3b82f6', borderRadius: '50%', width: '40px', height: '40px', margin: '0 auto 1.5rem auto', animation: 'spin 1s linear infinite' }}></div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Sincronizando con TACC</h3>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Estableciendo conexión segura...</p>
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
};

export default Callback;


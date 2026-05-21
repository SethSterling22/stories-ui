import { Authenticator } from '@tapis/tapis-typescript';
import apiGenerator from './apiGenerator';
import errorDecoder from './errorDecoder';

// --- NUEVO FLUJO OAUTH2 DINÁMICO POR LOCAL STORAGE ---
export const getTaccOauthUrl = (basePath: string): string => {
  const clientId = import.meta.env.VITE_OAUTH_CLIENT_ID || 'stories-ui-client';
  
  // El callback registrado en TACC siempre debe ser el oficial de producción
  const redirectUri = 'https://sram.stegosaurus-panga.ts.net/callback';
  
  // Guardamos el origen actual (ej: http://localhost:8080) en el navegador del usuario
  // Esto sobrevive aunque el usuario navegue a páginas externas como TACC
  sessionStorage.setItem('oauth_original_origin', window.location.origin);

  return `${basePath}/v3/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=openid`;
};

// --- FLUJO ANTERIOR CORREGIDO ---
const login = (
  username: string,
  password: string,
  basePath: string,
): Promise<Authenticator.RespCreateToken> => {
  const reqCreateToken: Authenticator.ReqCreateToken = {
    username,
    password,
    grant_type: 'password',
  };
  const request: Authenticator.CreateTokenRequest = {
    reqCreateToken,
  };

  // AQUÍ ESTÁ EL CAMBIO: Se agregó el '=' que faltaba para invocar la función generadora
  const api = apiGenerator<Authenticator.TokensApi>(
    Authenticator,
    Authenticator.TokensApi,
    basePath,
    null,
  );

  return errorDecoder(() => api.createToken(request));
  
};

export default login;
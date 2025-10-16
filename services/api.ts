// services/api.ts

const BASE_URL = 'http://localhost:3000/api';

async function fetchWrapper<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = localStorage.getItem('authToken');

  // Construir encabezados dinámicamente
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };


  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error en la red: ${response.status}`);
    }
    
    // Si la respuesta no tiene cuerpo (ej. DELETE), devuelve un objeto vacío
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return await response.json() as T;
  } catch (error) {
    console.error(`Error en la API: ${error}`);
    throw error;
  }
}

export const api = {
  // Auth
  login: (usuario: string, contrasena: string) => fetchWrapper<{ token: string, usuario: any }>('/usuarios/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, contrasena }),
  }),

  // Socios
  getSocios: () => fetchWrapper('/socios'),
  getSocio: (id: number) => fetchWrapper(`/socios/${id}`),
  addSocio: (socioData: Omit<any, 'id'>) => fetchWrapper('/socios', {
    method: 'POST',
    body: JSON.stringify(socioData),
  }),
  updateSocio: (id: number, socioData: any) => fetchWrapper(`/socios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(socioData),
  }),
  deleteSocio: (id: number) => fetchWrapper(`/socios/${id}`, {
    method: 'DELETE',
  }),

  // Actividades
  getActividades: () => fetchWrapper('/actividades'),
  addActividad: (actividadData: Omit<any, 'id'>) => fetchWrapper('/actividades', {
    method: 'POST',
    body: JSON.stringify(actividadData),
  }),
  updateActividad: (id: number, actividadData: any) => fetchWrapper(`/actividades/${id}`, {
    method: 'PUT',
    body: JSON.stringify(actividadData),
  }),
  deleteActividad: (id: number) => fetchWrapper(`/actividades/${id}`, {
    method: 'DELETE',
  }),

  // Categorias
  getCategorias: () => fetchWrapper('/categorias'),
  
  // Zonas
  getZonas: () => fetchWrapper('/zonas'),

  // Cobradores
  getCobradores: () => fetchWrapper('/cobradores'),
  addCobrador: (cobradorData: Omit<any, 'id'>) => fetchWrapper('/cobradores', {
    method: 'POST',
    body: JSON.stringify(cobradorData),
  }),
  updateCobrador: (id: number, cobradorData: any) => fetchWrapper(`/cobradores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(cobradorData),
  }),
  deleteCobrador: (id: number) => fetchWrapper(`/cobradores/${id}`, {
    method: 'DELETE',
  }),

  // Cobranzas
  getCobranzas: () => fetchWrapper('/cobranzas'),
  addCobranza: (cobranzaData: any) => fetchWrapper('/cobranzas', {
    method: 'POST',
    body: JSON.stringify(cobranzaData),
  }),
  getReporteCobranza: (cobradorId: number) => fetchWrapper(`/cobranzas/reporte/${cobradorId}`),


  // Casilleros
  getCasilleros: () => fetchWrapper('/casilleros'),
  addCasillero: (casilleroData: Omit<any, 'id'>) => fetchWrapper('/casilleros', {
    method: 'POST',
    body: JSON.stringify(casilleroData),
  }),
  updateCasillero: (id: number, casilleroData: any) => fetchWrapper(`/casilleros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(casilleroData),
  }),
  deleteCasillero: (id: number) => fetchWrapper(`/casilleros/${id}`, {
    method: 'DELETE',
  }),
};
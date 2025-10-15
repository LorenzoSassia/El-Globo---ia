// services/api.ts

const BASE_URL = 'http://localhost:3000';

async function fetchWrapper<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Aquí se podría agregar un token de autenticación si fuera necesario
      // 'Authorization': `Bearer ${token}`
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

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
  login: (usuario: string, contrasena: string) => fetchWrapper('/usuarios/login', {
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
  inscribirSocioActividad: (socioId: number, actividadId: number) => fetchWrapper(`/socios/${socioId}/actividades`, {
    method: 'POST',
    body: JSON.stringify({ actividadId }),
  }),
  desinscribirSocioActividad: (socioId: number, actividadId: number) => fetchWrapper(`/socios/${socioId}/actividades/${actividadId}`, {
    method: 'DELETE',
  }),


  // Categorias
  getCategorias: () => fetchWrapper('/categorias'),
  
  // Zonas
  getZonas: () => fetchWrapper('/zonas'),

  // Cobradores
  getCobradores: () => fetchWrapper('/cobradores'),

  // Cobranzas
  getCobranzas: () => fetchWrapper('/cobranzas'),
  addCobranza: (cobranzaData: any) => fetchWrapper('/cobranzas', {
    method: 'POST',
    body: JSON.stringify(cobranzaData),
  }),

  // Casilleros
  getCasilleros: () => fetchWrapper('/casilleros'),
  updateCasillero: (id: number, casilleroData: any) => fetchWrapper(`/casilleros/${id}`, {
      method: 'PUT',
      body: JSON.stringify(casilleroData),
  }),
};

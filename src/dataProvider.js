const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const normalizeListResult = (payload) => {
  if (Array.isArray(payload)) {
    return { data: payload, total: payload.length };
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) {
      return { data: payload.data, total: payload.total ?? payload.data.length };
    }

    if (Array.isArray(payload.items)) {
      return { data: payload.items, total: payload.total ?? payload.items.length };
    }
  }

  return { data: [], total: 0 };
};

const normalizeRecord = (payload) => {
  if (Array.isArray(payload)) {
    return payload[0] ?? null;
  }

  if (payload && typeof payload === 'object') {
    if (Array.isArray(payload.data)) {
      return payload.data[0] ?? null;
    }

    if (payload.data && typeof payload.data === 'object') {
      return payload.data;
    }
  }

  return payload ?? null;
};

export const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;

    const query = new URLSearchParams({
      _page: page - 1,
      _perPage: perPage,
      _sort: field,
      _order: order,
      ...params.filter,
    });

    const response = await fetch(`${API_URL}/${resource}?${query.toString()}`);
    if (!response.ok) throw new Error('Network error');
    const result = await response.json().catch(() => null);

    return normalizeListResult(result);
  },

  getOne: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`);
    if (!response.ok) throw new Error('Not found');
    const data = await response.json().catch(() => null);

    return { data: normalizeRecord(data) };
  },

  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) => fetch(`${API_URL}/${resource}/${id}`).then((res) => res.json()).catch(() => null))
    );
    return { data: responses.map(normalizeRecord) };
  },

  getManyReference: async (resource) => {
    const response = await fetch(`${API_URL}/${resource}`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json().catch(() => null);
    return normalizeListResult(data);
  },

  create: () => Promise.reject(new Error('Lecture seule')),
  update: () => Promise.reject(new Error('Lecture seule')),
  updateMany: () => Promise.reject(new Error('Lecture seule')),
  delete: () => Promise.reject(new Error('Lecture seule')),
  deleteMany: () => Promise.reject(new Error('Lecture seule')),
};

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const dataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const { city, weekend, from, to } = params.filter;

    const query = new URLSearchParams({
      _page: page - 1,
      _perPage: perPage,
      _sort: field,
      _order: order,
      ...(city && { city }),
      ...(weekend && { weekend }),
      ...(from && { from }),
      ...(to && { to }),
    });

    const response = await fetch(`${API_URL}/${resource}?${query.toString()}`);
    if (!response.ok) throw new Error('Error fetching data from API');
    

    const result = await response.json();
    
    if (Array.isArray(result)) {
      return { data: result, total: result.length };
    }
    return { data: result.data, total: result.total };
  },

  getOne: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}/${params.id}`);
    if (!response.ok) throw new Error('Item not found');
    const data = await response.json();
    return { data };
  },

  getMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) => fetch(`${API_URL}/${resource}/${id}`).then((res) => res.json()))
    );
    return { data: responses };
  },

  getManyReference: async (resource, params) => {
    const response = await fetch(`${API_URL}/${resource}`);
    const data = await response.json();
    return { data, total: data.length };
  },

  create: () => Promise.reject(new Error('Lecture seule active sur ce tableau de bord')),
  update: () => Promise.reject(new Error('Lecture seule active sur ce tableau de bord')),
  updateMany: () => Promise.reject(new Error('Lecture seule active sur ce tableau de bord')),
  delete: () => Promise.reject(new Error('Lecture seule active sur ce tableau de bord')),
  deleteMany: () => Promise.reject(new Error('Lecture seule active sur ce tableau de bord')),
};

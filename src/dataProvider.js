export const dataProvider = {
  getList: () => Promise.resolve({ data: [], total: 0 }),
  getOne: () => Promise.resolve({ data: {} }),
  getMany: () => Promise.resolve({ data: [] }),
  getManyReference: () => Promise.resolve({ data: [], total: 0 }),
  create: () => Promise.reject(new Error('Lecture seule')),
  update: () => Promise.reject(new Error('Lecture seule')),
  updateMany: () => Promise.reject(new Error('Lecture seule')),
  delete: () => Promise.reject(new Error('Lecture seule')),
  deleteMany: () => Promise.reject(new Error('Lecture seule')),
};
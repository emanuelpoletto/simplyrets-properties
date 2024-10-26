import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import seedData from '../../data/seed.json';
import { PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT } from '../../constants';
import { Property } from '../../entities';

describe('propertyRoutes', () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  
  beforeEach(async () => {
    await AppDataSource.manager.clear('Property');
    await seedDb();
  });

  describe('GET /properties', () => {
    const getFilteredData = (
      filterPredicate: (property: Property) => boolean,
      skip = PAGINATION_SKIP_DEFAULT,
      take = PAGINATION_TAKE_DEFAULT,
    ): { data: Property[]; count: number; } => {
      const filteredData = seedData.filter(filterPredicate);
      return {
        data: filteredData.slice(skip, skip + take),
        count: filteredData.length,
      };
    };

    it('should return all properties with default pagination', async () => {
      const response = await request(app).get('/properties');

      expect(response.body).toEqual({
        properties: seedData.slice(PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT),
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: seedData.length,
        },
      });
    });

    it('should return all properties with custom pagination', async () => {
      const response = await request(app).get('/properties?skip=1&take=2');

      expect(response.body).toEqual({
        properties: seedData.slice(1, 3),
        pagination: {
          skip: 1,
          take: 2,
          count: seedData.length,
        },
      });
    });

    it('should return all properties with filter for address', async () => {
      const address = 'Sweet';
      const filteredResult = getFilteredData((property) => property.address.includes(address));

      const response = await request(app).get(`/properties?address=${address}`);

      expect(response.body).toEqual({
        properties: filteredResult.data,
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: filteredResult.count,
        },
      });
    });

    it('should return all properties with filter for priceMin', async () => {
      const priceMin = 10000000;
      const filteredResult = getFilteredData((property) => property.price >= priceMin);

      const response = await request(app).get(`/properties?priceMin=${priceMin}`);

      expect(response.body).toEqual({
        properties: filteredResult.data,
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: filteredResult.count,
        },
      });
    });

    it('should return all properties with filter for priceMax', async () => {
      const priceMax = 10000000;
      const filteredResult = getFilteredData((property) => property.price <= priceMax);

      const response = await request(app).get(`/properties?priceMax=${priceMax}`);

      expect(response.body).toEqual({
        properties: filteredResult.data,
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: filteredResult.count,
        },
      });
    });

    it('should return all properties with filter for bedrooms', async () => {
      const bedrooms = 3;
      const filteredResult = getFilteredData((property) => property.bedrooms === bedrooms);

      const response = await request(app).get(`/properties?bedrooms=${bedrooms}`);

      expect(response.body).toEqual({
        properties: filteredResult.data,
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: filteredResult.count,
        },
      });
    });

    it('should return all properties with filter for bathrooms', async () => {
      const bathrooms = 2;
      const filteredResult = getFilteredData((property) => property.bathrooms === bathrooms);

      const response = await request(app).get(`/properties?bathrooms=${bathrooms}`);

      expect(response.body).toEqual({
        properties: filteredResult.data,
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: filteredResult.count,
        },
      });
    });

    it('should return all properties with filter for type', async () => {
      const type = 'House';
      const filteredResult = getFilteredData((property) => property.type === type);

      const response = await request(app).get(`/properties?type=${type}`);

      expect(response.body).toEqual({
        properties: filteredResult.data,
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: filteredResult.count,
        },
      });
    });

    it('should return all properties with order by address', async () => {
      const sortedData = [...seedData];
      sortedData.sort((a, b) => a.address.localeCompare(b.address));

      const response = await request(app).get('/properties?orderBy=address&order=ASC');

      expect(response.body).toEqual({
        properties: sortedData.slice(PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT),
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: seedData.length,
        },
      });
    });

    it('should return all properties with order by price', async () => {
      const sortedData = [...seedData];
      sortedData.sort((a, b) => b.price - a.price);

      const response = await request(app).get('/properties?orderBy=price&order=DESC');

      expect(response.body).toEqual({
        properties: sortedData.slice(PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT),
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: seedData.length,
        },
      });
    });

    it('should return all properties with order by bedrooms', async () => {
      const sortedData = [...seedData];
      sortedData.sort((a, b) => a.bedrooms - b.bedrooms);

      const response = await request(app).get('/properties?orderBy=bedrooms&order=ASC');

      expect(response.body).toEqual({
        properties: sortedData.slice(PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT),
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: seedData.length,
        },
      });
    });

    it('should return all properties with order by bathrooms', async () => {
      const sortedData = [...seedData];
      sortedData.sort((a, b) => b.bathrooms - a.bathrooms);
      
      const response = await request(app).get('/properties?orderBy=bathrooms&order=DESC');

      expect(response.body).toEqual({
        properties: sortedData.slice(PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT),
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: seedData.length,
        },
      });
    });

    it('should return all properties with order by type', async () => {
      const sortedData = [...seedData];
      sortedData.sort((a, b) => {
        if (a.type && b.type) return a.type.localeCompare(b.type)
          if (a.type && !b.type) return 1;
        if (!a.type && b.type) return -1;
        return 0;
      });

      const response = await request(app).get('/properties?orderBy=type&order=ASC');

      expect(response.body).toEqual({
        properties: sortedData.slice(PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT),
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: seedData.length,
        },
      });
    });
  });

  describe('GET /properties/:id', () => {
    it('should return property by id', async () => {
      const id = 1;
      const property = seedData.find((p) => p.id === id);

      const response = await request(app).get(`/properties/${id}`);

      expect(response.body).toEqual(property);
    });

    it('should return 404 if property not found', async () => {
      const id = 1000;

      const response = await request(app).get(`/properties/${id}`);

      expect(response.status).toBe(404);
    });

    it('should return 400 if id is not a number', async () => {
      const id = 'abc';

      const response = await request(app).get(`/properties/${id}`);

      expect(response.status).toBe(400);
    });
  });

  describe('POST /properties', () => {
    it('should create a new property', async () => {
      const property = {
        address: 'New Address',
        price: 12345678,
        bedrooms: 3,
        bathrooms: 2,
        type: 'House',
      };

      const {
        body: {
          id: createdId,
          ...createdProperty
        }
      } = await request(app).post('/properties').send(property);

      expect(createdId).toBeGreaterThan(seedData.length);
      expect(createdProperty).toEqual(property);
    });

    it('should return 400 if address is missing', async () => {
      const property = {
        price: 12345678,
        bedrooms: 3,
        bathrooms: 2,
        type: 'House',
      };

      const response = await request(app).post('/properties').send(property);

      expect(response.status).toBe(400);
    });

    it('should return 400 if price is missing', async () => {
      const property = {
        address: 'New Address',
        bedrooms: 3,
        bathrooms: 2,
        type: 'House',
      };

      const response = await request(app).post('/properties').send(property);

      expect(response.status).toBe(400);
    });

    it('should return 400 if bedrooms is missing', async () => {
      const property = {
        address: 'New Address',
        price: 10000000,
        bathrooms: 2,
        type: 'House',
      };

      const response = await request(app).post('/properties').send(property);

      expect(response.status).toBe(400);
    });

    it('should return 400 if bathrooms is missing', async () => {
      const property = {
        address: 'New Address',
        price: 12345678,
        bedrooms: 3,
        type: 'House',
      };

      const response = await request(app).post('/properties').send(property);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /properties/:id', () => {
    it('should update a property', async () => {
      const id = 1;
      const property = {
        address: 'Updated Address',
        price: 87654321,
        bedrooms: 4,
        bathrooms: 3,
        type: 'Apartment',
      };

      const {
        body: {
          id: updatedId,
          ...updatedProperty
        }
      } = await request(app).put(`/properties/${id}`).send(property);

      expect(updatedId).toBe(id);
      expect(updatedProperty).toEqual(property);
    });

    it('should return 404 if property not found', async () => {
      const id = 1000;
      const property = {
        address: 'Updated Address',
        price: 87654321,
        bedrooms: 4,
        bathrooms: 3,
        type: 'Apartment',
      };

      const response = await request(app).put(`/properties/${id}`).send(property);

      expect(response.status).toBe(404);
    });

    it('should return 400 if id is not a number', async () => {
      const id = 'abc';
      const property = {
        address: 'Updated Address',
        price: 87654321,
        bedrooms: 4,
        bathrooms: 3,
        type: 'Apartment',
      };

      const response = await request(app).put(`/properties/${id}`).send(property);

      expect(response.status).toBe(400);
    });

    it('should return 400 if address is missing', async () => {
      const id = 1;
      const property = {
        price: 87654321,
        bedrooms: 4,
        bathrooms: 3,
        type: 'Apartment',
      };

      const response = await request(app).put(`/properties/${id}`).send(property);

      expect(response.status).toBe(400);
    });

    it('should return 400 if price is missing', async () => {
      const id = 1;
      const property = {
        address: 'Updated Address',
        bedrooms: 4,
        bathrooms: 3,
        type: 'Apartment',
      };

      const response = await request(app).put(`/properties/${id}`).send(property);

      expect(response.status).toBe(400);
    });

    it('should return 400 if bedrooms is missing', async () => {
      const id = 1;
      const property = {
        address: 'Updated Address',
        price: 87654321,
        bathrooms: 3,
        type: 'Apartment',
      };

      const response = await request(app).put(`/properties/${id}`).send(property);

      expect(response.status).toBe(400);
    });

    it('should return 400 if bathrooms is missing', async () => {
      const id = 1;
      const property = {
        address: 'Updated Address',
        price: 87654321,
        bedrooms: 4,
        type: 'Apartment',
      };

      const response = await request(app).put(`/properties/${id}`).send(property);

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should delete a property', async () => {
      const id = 1;

      const response = await request(app).delete(`/properties/${id}`);

      expect(response.status).toBe(204);
    });

    it('should return 404 if property not found', async () => {
      const id = 1000;

      const response = await request(app).delete(`/properties/${id}`);

      expect(response.status).toBe(404);
    });

    it('should return 400 if id is not a number', async () => {
      const id = 'abc';

      const response = await request(app).delete(`/properties/${id}`);

      expect(response.status).toBe(400);
    });
  });
});

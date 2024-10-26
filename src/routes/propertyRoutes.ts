import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { body, matchedData, param, query, validationResult } from 'express-validator';
import { PropertyService } from '../services/PropertyService';
import { PAGINATION_SKIP_MIN, PAGINATION_TAKE_MAX, PAGINATION_TAKE_MIN } from '../constants';
import { Property } from '../entities';
import { PropertyError } from '../errors/PropertyError';
import type { PaginationInput } from '../interfaces/PaginationInterface';
import type { PropertyFilter, PropertyInput, PropertyOrder } from '../interfaces/PropertyInterface';

export const propertyRoutes = express.Router();

const propertyService = new PropertyService();

propertyRoutes.use(bodyParser.json());

const handleRequestValidation = (req: Request, res: Response, next: NextFunction) => {
  const validationError = validationResult(req);

  if (!validationError.isEmpty()) {
    return res.status(400).send({ errors: validationError.array() });
  }

  next();
};

propertyRoutes.get('/',
  query('skip').optional().isInt({ min: PAGINATION_SKIP_MIN }).toInt(),
  query('take').optional().isInt({ min: PAGINATION_TAKE_MIN, max: PAGINATION_TAKE_MAX }).toInt(),
  query('address').optional().isString().isLength({ min: 3 }).escape(),
  query('priceMin').optional().isFloat({ min: 0 }).toFloat(),
  query('priceMax').optional().isFloat({ min: 0 }).toFloat(),
  query('bedrooms').optional().isInt({ min: 0 }).toInt(),
  query('bathrooms').optional().isInt({ min: 0 }).toInt(),
  query('type').optional().isString().escape(),
  query('orderBy').optional().isString().isIn(['id', 'address', 'price', 'bedrooms', 'bathrooms', 'type']),
  query('order').optional().isString().isIn(['ASC', 'DESC', 'asc', 'desc']),
  handleRequestValidation,
  async (req, res, next) => {
    const queryData = matchedData<PaginationInput & PropertyFilter & PropertyOrder>(req);

    try {
      const properties = await propertyService.getAll(queryData);
      return res.send(properties);
    } catch (error) {
      next(error);
    }
  },
);

propertyRoutes.get('/:id',
  param('id').notEmpty().isInt().toInt(),
  handleRequestValidation,
  async (req, res, next) => {
    const { id } = matchedData<{ id: number }>(req);

    try {
      const property = await propertyService.getById(id);
      return res.send(property);
    } catch (error) {
      next(error);
    }
  },
);

const propertyBodyValidation = () => [
  body('address').trim().notEmpty().isString().escape(),
  body('price').trim().notEmpty().isFloat().toFloat(),
  body('bedrooms').trim().notEmpty().isInt().toInt(),
  body('bathrooms').trim().notEmpty().isInt().toInt(),
  body('type').trim().optional().isString().escape(),
];

propertyRoutes.post('/',
  ...propertyBodyValidation(),
  handleRequestValidation,
  async (req, res, next) => {
    const { address, price, bedrooms, bathrooms, type } = matchedData<PropertyInput>(req);

    try {
      const createdProperty = await propertyService.create({ address, price, bedrooms, bathrooms, type });
      return res.status(201).send(createdProperty);
    } catch (error) {
      next(error);
    }
  },
);

propertyRoutes.put('/:id',
  param('id').notEmpty().isInt().toInt(),
  ...propertyBodyValidation(),
  handleRequestValidation,
  async (req, res, next) => {
    const { id, address, price, bedrooms, bathrooms, type, } = matchedData<Property>(req);

    try {
      const updatedProperty = await propertyService.update(id, { address, price, bedrooms, bathrooms, type });
      return res.send(updatedProperty);
    } catch (error) {
      next(error);
    }
  },
);

propertyRoutes.delete('/:id',
  param('id').notEmpty().isInt().toInt(),
  handleRequestValidation,
  async (req, res, next) => {
    const { id } = matchedData<{ id: number }>(req);

    try {
      await propertyService.delete(id);
      return res.status(204).send('Property deleted');
    } catch (error) {
      next(error);
    }
  },
);

propertyRoutes.use((err: PropertyError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  return res.status(err.statusCode || 500).send(err.message || 'Internal server error');
});

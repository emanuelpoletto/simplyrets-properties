import { And, ILike, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Property } from '../entities';
import { PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT } from '../constants';
import AppDataSource from '../dataSource';
import { PropertyNotFoundError } from '../errors/PropertyError';
import type { PaginationInput } from '../interfaces/PaginationInterface';
import type { PropertiesResponse, PropertyFilter, PropertyInput, PropertyOrder } from '../interfaces/PropertyInterface';

export class PropertyService {
  constructor(
    private readonly propertyRepository: Repository<Property> = AppDataSource.getRepository(Property)
  ) {}

  async getAll({
    skip = PAGINATION_SKIP_DEFAULT,
    take = PAGINATION_TAKE_DEFAULT,
    address,
    priceMin,
    priceMax,
    bedrooms,
    bathrooms,
    type,
    orderBy = 'id',
    order = 'ASC',
  }: PaginationInput & PropertyFilter & PropertyOrder): Promise<PropertiesResponse> {
    const filter: Record<string, unknown> = {};
    if (address !== undefined) filter.address = ILike(`%${address}%`);
    if (priceMin !== undefined && priceMax === undefined) filter.price = MoreThan(priceMin);
    if (priceMax !== undefined && priceMin === undefined) filter.price = LessThan(priceMax);
    if (priceMax !== undefined && priceMin !== undefined) filter.price = And(MoreThanOrEqual(priceMin), LessThanOrEqual(priceMax));
    if (bedrooms !== undefined) filter.bedrooms = bedrooms;
    if (bathrooms !== undefined) filter.bathrooms = bathrooms;
    if (type !== undefined) filter.type = ILike(type);

    const [results, count] = await this.propertyRepository.findAndCount({
      skip,
      take,
      where: { ...filter},
      order: { [orderBy]: order }
    });

    return {
      properties: results,
      pagination: {
        skip: Number(skip),
        take: Number(take),
        count
      }
    }
  }

  async getById(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOneBy({ id });

    if (!property) {
      throw new PropertyNotFoundError();
    }

    return property;
  }

  create(property: PropertyInput): Promise<Property | PropertyInput> {
    return this.propertyRepository.save(property);
  }

  async update(id: number, property: PropertyInput): Promise<Property | boolean> {
    const propertyExists = await this.propertyRepository.exist({ where: { id } });

    if (!propertyExists) {
      throw new PropertyNotFoundError();
    }

    const updateResult = await this.propertyRepository.update(id, property);
    
    return updateResult.affected === 1 ? { ...property, id } : false;
  }

  async delete(id: number): Promise<boolean> {
    const propertyExists = await this.propertyRepository.exist({ where: { id } });

    if (!propertyExists) {
      throw new PropertyNotFoundError();
    }

    return (await this.propertyRepository.delete(id)).affected === 1;
  }
}

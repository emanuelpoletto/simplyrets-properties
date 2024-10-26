import { EntityManager, Repository } from 'typeorm';
import { PropertyService } from '../PropertyService';
import { Property } from '../../entities';
import { PropertyNotFoundError } from '../../errors/PropertyError';
import { PAGINATION_SKIP_DEFAULT, PAGINATION_TAKE_DEFAULT } from '../../constants';

jest.mock('typeorm/repository/Repository', () => ({
  Repository: jest.fn().mockImplementation(() => ({
    findAndCount: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    exist: jest.fn(),
  })),
}));

const mockProperties = [
  {
    id: 1,
    address: "74434 East Sweet Bottom Br #18393",
    price: 20714261,
    bedrooms: 2,
    bathrooms: 5,
    type: null,
  },
  {
    id: 2,
    address: "8369 West MAJESTY STREET Path #1765",
    price: 9375751,
    bedrooms: 3,
    bathrooms: 6,
    type: null,
  },
  {
    id: 3,
    address: "90678 South VELLUM Extension #6A2",
    price: 12104869,
    bedrooms: 5,
    bathrooms: 4,
    type: null,
  },
];

describe('PropertyService', () => {
  let propertyService: PropertyService;
  let propertyRepository: Repository<Property>;

  beforeEach(() => {
    propertyRepository = new Repository<Property>(Property, {} as EntityManager);
    propertyService = new PropertyService(propertyRepository);
  });

  describe('getAll', () => {
    it('should return properties with pagination', async () => {
      (propertyRepository.findAndCount as jest.Mock).mockResolvedValue([mockProperties, mockProperties.length]);

      const result = await propertyService.getAll({
        skip: PAGINATION_SKIP_DEFAULT,
        take: PAGINATION_TAKE_DEFAULT,
      });

      expect(result).toEqual({
        properties: mockProperties,
        pagination: {
          skip: PAGINATION_SKIP_DEFAULT,
          take: PAGINATION_TAKE_DEFAULT,
          count: mockProperties.length,
        },
      });
    });
  });

  describe('getById', () => {
    it('should return a property by id', async () => {
      const [mockProperty] = mockProperties;
      (propertyRepository.findOneBy as jest.Mock).mockResolvedValue(mockProperty);

      const result = await propertyService.getById(mockProperty.id);

      expect(result).toEqual(mockProperty);
    });

    it('should throw PropertyNotFoundError if property not found', async () => {
      (propertyRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(propertyService.getById(1)).rejects.toThrow(PropertyNotFoundError);
    });
  });

  describe('create', () => {
    it('should create a new property', async () => {
      const { id, ...mockPropertyInput } = mockProperties[0];
      const [mockProperty] = mockProperties;
      (propertyRepository.save as jest.Mock).mockResolvedValue(mockProperty);

      const result = await propertyService.create(mockPropertyInput);

      expect(result).toEqual(mockProperty);
    });
  });

  describe('update', () => {
    it('should update an existing property', async () => {
      const { id, ...mockPropertyInput } = mockProperties[1];
      (propertyRepository.exist as jest.Mock).mockResolvedValue(true);
      (propertyRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await propertyService.update(1, mockPropertyInput);

      expect(result).toEqual({ ...mockPropertyInput, id: 1 });
    });

    it('should throw PropertyNotFoundError if property not found', async () => {
      const { id, ...mockPropertyInput } = mockProperties[1];
      (propertyRepository.exist as jest.Mock).mockResolvedValue(false);

      await expect(propertyService.update(1, mockPropertyInput)).rejects.toThrow(PropertyNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete an existing property', async () => {
      (propertyRepository.exist as jest.Mock).mockResolvedValue(true);
      (propertyRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await propertyService.delete(1);

      expect(result).toBe(true);
    });

    it('should throw PropertyNotFoundError if property not found', async () => {
      (propertyRepository.exist as jest.Mock).mockResolvedValue(false);

      await expect(propertyService.delete(1)).rejects.toThrow(PropertyNotFoundError);
    });
  });
});
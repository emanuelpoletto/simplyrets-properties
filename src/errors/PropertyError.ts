export interface IPropertyError extends Error {
  statusCode: number;
}

export class PropertyError extends Error implements IPropertyError {
  statusCode: number;

  constructor(message = 'Internal server error', statusCode = 500) {
    super(message);
    this.name = 'PropertyError';
    this.statusCode = statusCode;
  }
}

export class PropertyNotFoundError extends PropertyError {
  constructor() {
    super('Property not found', 404);
  }
}

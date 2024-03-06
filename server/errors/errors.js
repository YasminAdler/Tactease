class NotFound extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.status = 404
  }
}

class EntityNotFoundError extends NotFound {
    constructor (entity) {
        super(`${entity} not found`)
        this.name = this.constructor.name
        this.entity = entity
    }
}

class PropertyNotFoundError extends NotFound {
    constructor (property) {
        super(`${property} not found`)
        this.name = this.constructor.name
        this.property = property
    }
}

module.exports = {
    EntityNotFoundError,
    PropertyNotFoundError
}
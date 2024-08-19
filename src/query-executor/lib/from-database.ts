type Constructor<T> = new () => T;

export const fromDatabase = <T extends Record<string, any>>(
  dbObject: Record<string, any>,
  EntityClass: Constructor<T>,
) => {
  if (!dbObject) {
    return dbObject;
  }
  const entity = new EntityClass();
  const columns = EntityClass.prototype.constructor.__columns as Record<
    string,
    string
  >;

  for (const [propertyKey, dbColumn] of Object.entries(columns)) {
    (entity as any)[propertyKey] = dbObject[dbColumn];
  }

  return entity;
};

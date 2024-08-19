export const Column = (name?: string): PropertyDecorator => {
  return (target: any, propertyKey: string | symbol) => {
    if (!target.constructor.__columns) {
      target.constructor.__columns = {};
    }

    target.constructor.__columns[propertyKey] = name || propertyKey;
  };
};

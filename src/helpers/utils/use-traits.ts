import { getMetadataArgsStorage } from 'typeorm';

export function useTraits(extendClass, ...traits) {
  const derived = extendClass
    ? class extends extendClass {
        constructor(...args) {
          super(args);
        }
      }
    // tslint:disable-next-line:max-classes-per-file
    : class {};

  traits.forEach(trait => {
    // Object.getOwnPropertyNames(trait.prototype).forEach(name => {
    //   Object.defineProperty(
    //     derived.prototype,
    //     name,
    //     Object.getOwnPropertyDescriptor(trait.prototype, name),
    //   );
    // });
    console.log(getMetadataArgsStorage().columns.filter(value => value.target === trait));
  });

  return derived;
}

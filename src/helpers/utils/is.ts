import { FindConditions, getMetadataArgsStorage } from 'typeorm';
import { isObject } from '@nestjs/common/utils/shared.utils';

export function isFindConditionsOf<T>(
  maybeCondition: any,
  // tslint:disable-next-line:ban-types
  type: Function | string,
): maybeCondition is FindConditions<T> {
  if (!isObject(maybeCondition)) {
    return false;
  }
  return Object.keys(maybeCondition).every(
    key =>
      key in
      getMetadataArgsStorage()
        .columns.filter(column => column.target === type)
        .map(column => column.propertyName),
  );
}

export function isFindOptions(maybeOptions: any): boolean {
  const propertyAndRequirementMap = {
    select: false,
    where: false,
    relations: false,
    join: false,
    order: false,
    cache: false,
    lock: false,
    loadRelationIds: false,
    loadEagerRelations: false,
    skip: false,
    take: false,
  };

  return Object.keys(maybeOptions).every(key =>
    Object.keys(propertyAndRequirementMap).includes(key),
  );
}

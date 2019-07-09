import {
  ColumnOptions,
  DeepPartial,
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getMetadataArgsStorage,
  InsertResult,
  ObjectID,
  ObjectLiteral,
  RemoveOptions,
  Repository,
  SaveOptions,
  UpdateResult,
} from 'typeorm';
import { loadObjectWithRequirements } from '../utils/load-object';
import { convertToList } from '../utils/convert';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { isFindConditionsOf, isFindOptions } from '../utils/is';
import { cloneDeep, merge } from 'lodash';

interface SoftDeleteOptions {
  key: string;
  columnOptions: ColumnOptions;
}

const defaultColumnOption: ColumnOptions = {
  type: 'timestamp',
  nullable: true,
};

const deleteColumnSymbol = Symbol('deleteColumn');

export class SoftDeleteRepository<
  Entity extends ObjectLiteral
> extends Repository<Entity> {
  private readonly softDeleteColumnKey: string;

  constructor(entityManager, entityMetadata) {
    super();
    this.softDeleteColumnKey = Reflect.getMetadata(
      deleteColumnSymbol,
      entityMetadata.target,
    );
  }

  hasId(entity: Entity, ignoreSoftDelete: boolean = false): boolean {
    if (!ignoreSoftDelete) {
      return super.hasId(entity);
    }
    return super.hasId(
      loadObjectWithRequirements(entity, { [this.softDeleteColumnKey]: null }),
    );
  }

  getId(entity: Entity, ignoreSoftDelete: boolean = false): any {
    if (!ignoreSoftDelete) {
      return super.getId(entity);
    }
    return super.getId(
      loadObjectWithRequirements(entity, { [this.softDeleteColumnKey]: null }),
    );
  }

  preload(
    entityLike: DeepPartial<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<Entity | undefined> {
    if (!ignoreSoftDelete) {
      return super.preload(entityLike);
    }
    return super.preload(
      loadObjectWithRequirements(entityLike, {
        [this.softDeleteColumnKey]: null,
      }),
    );
  }

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options: SaveOptions & { reload: false },
    ignoreSoftDelete?: boolean,
  ): Promise<T[]>;

  save<T extends DeepPartial<Entity>>(
    entities: T[],
    options?: SaveOptions,
    ignoreSoftDelete?: boolean,
  ): Promise<Array<T & Entity>>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options: SaveOptions & { reload: false },
    ignoreSoftDelete?: boolean,
  ): Promise<T>;

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
    ignoreSoftDelete?: boolean,
  ): Promise<T & Entity>;

  save<T extends DeepPartial<Entity>>(
    entityOrEntities: T | T[],
    options: SaveOptions = {},
    ignoreSoftDelete: boolean = false,
  ): Promise<T | T[]> {
    if (ignoreSoftDelete) {
      return super.save<T>(entityOrEntities as any, options);
    }
    return super.save<T>(
      convertToList<any>(entityOrEntities).map(entity =>
        loadObjectWithRequirements(entity, {
          [this.softDeleteColumnKey]: null,
        }),
      ),
      options,
    );
  }

  remove(
    entities: Entity[],
    options?: RemoveOptions,
    ignoreSoftDelete?: boolean,
  ): Promise<Entity[]>;

  remove(
    entity: Entity,
    options?: RemoveOptions,
    ignoreSoftDelete?: boolean,
  ): Promise<Entity>;

  remove(
    entityOrEntities: Entity | Entity[],
    options: RemoveOptions = {},
    ignoreSoftDelete: boolean = false,
  ): Promise<Entity | Entity[]> {
    if (ignoreSoftDelete) {
      return super.remove(entityOrEntities as any, options);
    }
    return this.save(
      convertToList(entityOrEntities)
        .map(entity => cloneDeep(entity))
        .map(entity => {
          entity[this.softDeleteColumnKey] = new Date().toISOString();
          return entity;
        }),
      options,
      false,
    );
  }

  insert(
    entityOrEntities:
      | QueryDeepPartialEntity<Entity>
      | (Array<QueryDeepPartialEntity<Entity>>),
    ignoreSoftDelete: boolean = false,
  ): Promise<InsertResult> {
    if (ignoreSoftDelete) {
      return super.insert(entityOrEntities);
    }
    return super.insert(
      convertToList<QueryDeepPartialEntity<Entity>>(entityOrEntities).map(
        entity =>
          loadObjectWithRequirements(entity, {
            [this.softDeleteColumnKey]: null,
          }),
      ),
    );
  }

  update(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindConditions<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<UpdateResult> {
    if (ignoreSoftDelete) {
      return super.update(criteria as any, partialEntity);
    }

    if (isFindConditionsOf(criteria, this.metadata.target)) {
      return super.update(
        loadObjectWithRequirements(criteria, {
          [this.softDeleteColumnKey]: null,
        }),
        partialEntity,
      );
    }
    return this.manager
      .createQueryBuilder()
      .update(this.metadata.target)
      .set(partialEntity)
      .where({ [this.softDeleteColumnKey]: null })
      .whereInIds(criteria)
      .execute();
  }

  delete(
    criteria:
      | string
      | string[]
      | number
      | number[]
      | Date
      | Date[]
      | ObjectID
      | ObjectID[]
      | FindConditions<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<DeleteResult> {
    if (ignoreSoftDelete) {
      return super.delete(criteria as any);
    }
    if (isFindConditionsOf(criteria, this.metadata.target)) {
      return super.update(
        loadObjectWithRequirements(criteria, {
          [this.softDeleteColumnKey]: null,
        }),
        ({
          [this.softDeleteColumnKey]: new Date().toISOString(),
        } as unknown) as QueryDeepPartialEntity<Entity>,
      );
    }

    return this.update(criteria, {
      [this.softDeleteColumnKey]: new Date().toISOString(),
    } as any);
  }

  count(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<number> {
    if (ignoreSoftDelete) {
      return super.count(optionsOrConditions);
    }

    if (isFindConditionsOf(optionsOrConditions, this.metadata.target)) {
      return super.count(
        loadObjectWithRequirements(
          optionsOrConditions as FindConditions<Entity>,
          {
            [this.softDeleteColumnKey]: null,
          },
        ),
      );
    }

    return super.count({
      ...(optionsOrConditions as FindManyOptions<Entity>),
      where: loadObjectWithRequirements(
        (optionsOrConditions as FindManyOptions<Entity>).where,
        { [this.softDeleteColumnKey]: null },
      ),
    });
  }

  find(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<Entity[]> {
    if (ignoreSoftDelete) {
      return super.find(optionsOrConditions);
    }

    if (isFindConditionsOf(optionsOrConditions, this.metadata.target)) {
      return super.find(
        loadObjectWithRequirements(
          optionsOrConditions as FindConditions<Entity>,
          {
            [this.softDeleteColumnKey]: null,
          },
        ),
      );
    }

    return super.find({
      ...(optionsOrConditions as FindManyOptions<Entity>),
      where: loadObjectWithRequirements(
        (optionsOrConditions as FindManyOptions<Entity>).where,
        { [this.softDeleteColumnKey]: null },
      ),
    });
  }

  findAndCount(
    optionsOrConditions?: FindManyOptions<Entity> | FindConditions<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<[Entity[], number]> {
    if (ignoreSoftDelete) {
      return super.findAndCount(optionsOrConditions);
    }

    if (isFindConditionsOf(optionsOrConditions, this.metadata.target)) {
      return super.findAndCount(
        loadObjectWithRequirements(
          optionsOrConditions as FindConditions<Entity>,
          {
            [this.softDeleteColumnKey]: null,
          },
        ),
      );
    }

    return super.findAndCount({
      ...(optionsOrConditions as FindManyOptions<Entity>),
      where: loadObjectWithRequirements(
        (optionsOrConditions as FindManyOptions<Entity>).where,
        { [this.softDeleteColumnKey]: null },
      ),
    });
  }

  findByIds(
    ids: any[],
    optionsOrConditions: FindManyOptions<Entity> | FindConditions<Entity> = {},
    ignoreSoftDelete: boolean = false,
  ): Promise<Entity[]> {
    if (ignoreSoftDelete) {
      return super.findByIds(ids, optionsOrConditions);
    }

    if (isFindConditionsOf(optionsOrConditions, this.metadata.target)) {
      return super.findByIds(
        ids,
        loadObjectWithRequirements(
          optionsOrConditions as FindConditions<Entity>,
          {
            [this.softDeleteColumnKey]: null,
          },
        ),
      );
    }

    return super.findByIds(ids, {
      ...(optionsOrConditions as FindManyOptions<Entity>),
      where: loadObjectWithRequirements(
        (optionsOrConditions as FindManyOptions<Entity>).where,
        { [this.softDeleteColumnKey]: null },
      ),
    });
  }

  findOne(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOneOptions<Entity>
      | FindConditions<Entity>,
    maybeOptions?: FindOneOptions<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<Entity | undefined> {
    if (ignoreSoftDelete) {
      return super.findOne(optionsOrConditions as any, maybeOptions);
    }

    if (isFindConditionsOf(optionsOrConditions, this.metadata.target)) {
      return super.findOne(
        loadObjectWithRequirements(optionsOrConditions, {
          [this.softDeleteColumnKey]: null,
        }),
        maybeOptions,
      );
    }

    if (isFindOptions(optionsOrConditions)) {
      const mergeOptions = merge(optionsOrConditions, maybeOptions);
      return super.findOne({
        ...(mergeOptions as FindOneOptions<Entity>),
        where: loadObjectWithRequirements(
          (mergeOptions as FindOneOptions<Entity>).where,
          { [this.softDeleteColumnKey]: null },
        ),
      });
    }

    return this.manager
      .createQueryBuilder()
      .where({
        [this.softDeleteColumnKey]: null,
      })
      .whereInIds(optionsOrConditions)
      .execute();
  }

  findOneOrFail(
    optionsOrConditions?:
      | string
      | number
      | Date
      | ObjectID
      | FindOneOptions<Entity>
      | FindConditions<Entity>,
    maybeOptions?: FindOneOptions<Entity>,
    ignoreSoftDelete: boolean = false,
  ): Promise<Entity> {
    if (ignoreSoftDelete) {
      return super.findOneOrFail(optionsOrConditions as any, maybeOptions);
    }

    if (isFindConditionsOf(optionsOrConditions, this.metadata.target)) {
      return super.findOneOrFail(
        loadObjectWithRequirements(optionsOrConditions, {
          [this.softDeleteColumnKey]: null,
        }),
        maybeOptions,
      );
    }

    if (isFindOptions(optionsOrConditions)) {
      const mergeOptions = merge(optionsOrConditions, maybeOptions);
      return super.findOneOrFail({
        ...(mergeOptions as FindOneOptions<Entity>),
        where: loadObjectWithRequirements(
          (mergeOptions as FindOneOptions<Entity>).where,
          { [this.softDeleteColumnKey]: null },
        ),
      });
    }

    return super.findOneOrFail(optionsOrConditions, {
      ...maybeOptions,
      where: loadObjectWithRequirements(maybeOptions.where, {
        [this.softDeleteColumnKey]: null,
      }),
    });
  }
}

export function SoftDelete(options?: SoftDeleteOptions) {
  const deleteColumnKey = !options || !options.key ? 'deletedAt' : options.key;

  // tslint:disable-next-line:ban-types
  return function decorator(target: Function) {
    Reflect.defineMetadata(deleteColumnSymbol, deleteColumnKey, target);

    getMetadataArgsStorage().columns.push({
      target,
      mode: 'regular',
      propertyName: deleteColumnKey,
      options:
        !options || !options.columnOptions
          ? { ...defaultColumnOption, name: deleteColumnKey }
          : options.columnOptions,
    });
    getMetadataArgsStorage().entityRepositories.push({
      target: SoftDeleteRepository,
      entity: target,
    });
  };
}

import {LucidRow} from '@ioc:Adonis/Lucid/Model';
import {SimplePaginatorContract} from "@ioc:Adonis/Lucid/DatabaseQueryBuilder";
import {RequestContract} from '@ioc:Adonis/Core/Request';
import {DateTime} from 'luxon';
import {pascalCase} from 'change-case';

export type IncludeMethodOptions = {
  nestedIncludes: string;
};

export default abstract class TransformerAbstract<Model extends LucidRow = LucidRow,
  TransformedEntity = any> {
  /**
   * Transform serializedData into object
   * @param  serializedData serializedData to be transformed
   * @param  item           LucidRow instance being transformed
   * @return                Promise that resolves to JSON with transformed data
   */
  protected abstract transform(serializedData: any, item?: LucidRow): Promise<object>;

  protected defaultIncludes: string[] = [];
  protected availableIncludes: string[] = [];

  /**
   * Method to transform a single Model Object
   * @param  item                    Object to be transformed
   * @param  options                 Object of options. Can include transformMethod, include, exclude & request keys.
   * @param  options.transformMethod Method to be used to transform item. Must be defined in model specific transformer. If not given, 'transform' will be used
   * @param  options.include         Comma-separated string of relationships to be included.
   * @param  options.exlcude         Comma-separated string of relationships to be excluded.
   * @param  options.request         Request context. If provided, include & exclude inputs will be parsed to dynamically include & exclude relationships
   * @return                         Promise that resolves to transformed JSON.
   */
  public async transformItem(
    item: LucidRow | null,
    options?: TransformItemOptions<true>
  ): Promise<TransformedEntity>;
  public async transformItem(
    item: LucidRow | null,
    options: TransformItemOptions<false>
  ): Promise<TransformedEntity | null>;
  public async transformItem(
    item: LucidRow | null,
    options: TransformItemOptions<boolean> = {}
  ): Promise<TransformedEntity | null> {
    const {
      transformMethod = 'transform',
      include = '',
      exclude = '',
      request = undefined,
    } = options;
    if (!item) {
      if (!options.throwError) {
        return null;
      }
      throw new Error('Model not passed to transformer');
    }
    const serializedData = item.serialize();
    const inclusionList = this.parseInclusions(include, exclude, request);
    const inclusions = {};
    await Promise.all(
      inclusionList.map(async (eachInclusion) => {
        const nestedIncludeArray = eachInclusion.split('.');
        const topInclusion = nestedIncludeArray[0];
        const methodName = `include${pascalCase(topInclusion)}`;
        nestedIncludeArray.splice(0, 1);
        inclusions[topInclusion] = await this[methodName](item, {
          nestedIncludes: nestedIncludeArray.length > 0 ? nestedIncludeArray.join('.') : undefined,
        });
      })
    );
    const transformedItem = await this[transformMethod](serializedData, item);
    return {
      ...transformedItem,
      ...inclusions,
    };
  }

  /**
   * Method to transform collection.
   * Method checks if collection is a paginated contract or not and calls appropriate method.
   * Will call transformItem on every Model.
   * @param  collection              Array of models
   * @param  options                 Object of options. Can include transformMethod, include, exclude & request keys.
   * @param  options.transformMethod Method to be used to transform item. Must be defined in model specific transformer. If not given, 'transform' will be used
   * @param  options.include         Comma-separated string of relationships to be included.
   * @param  options.exlcude         Comma-separated string of relationships to be excluded.
   * @param  options.request         Request context. If provided, include & exclude inputs will be parsed to dynamically include & exclude relationships
   * @return                         Promise that resolves to transformed JSON.
   */
  public async transformCollection(
    collection: Array<Model> | undefined,
    options?: TransformCollectionOptions
  ): Promise<any[]>;
  // public async transformCollection(
  //   collection: SimplePaginatorContract<Model> | undefined,
  //   options?: TransformCollectionOptions
  // ): Promise<CustomTypes.TransformedDataWithMetadata<CustomTypes.PaginationMetadata>>;
  public async transformCollection(
    collection: Array<Model> | SimplePaginatorContract<Model> | undefined,
    options: TransformCollectionOptions = {}
  ) {
    if (!collection) {
      throw new Error('Collection not passed to transformer');
    }
    return this.transformCollectionWithoutPagination(collection, options);
  }

  /**
   * Method to transform collection. Will call transformItem on every Model.
   * @param  collection              Array of models
   * @param  options                 Object of options. Can include transformMethod, include, exclude & request keys.
   * @param  options.transformMethod Method to be used to transform item. Must be defined in model specific transformer. If not given, 'transform' will be used
   * @param  options.include         Comma-separated string of relationships to be included.
   * @param  options.exlcude         Comma-separated string of relationships to be excluded.
   * @param  options.request         Request context. If provided, include & exclude inputs will be parsed to dynamically include & exclude relationships
   * @return                         Promise that resolves to transformed JSON.
   */
  protected async transformCollectionWithoutPagination(
    collection: Array<LucidRow> | undefined,
    options: TransformCollectionOptions = {}
  ): Promise<any[]> {
    if (!collection) {
      throw new Error('Collection not passed to transformer');
    }
    return await Promise.all(
      collection.map(async (eachItem) => await this.transformItem(eachItem, options))
    );
  }

  /**
   * Method to transform collection with pagination. Will call transformItem on every Model.
   * @param  paginator               Instance of paginator
   * @param  options                 Object of options. Can include transformMethod, include, exclude & request keys.
   * @param  options.transformMethod Method to be used to transform item. Must be defined in model specific transformer. If not given, 'transform' will be used
   * @param  options.include         Comma-separated string of relationships to be included.
   * @param  options.exlcude         Comma-separated string of relationships to be excluded.
   * @param  options.request         Request context. If provided, include & exclude inputs will be parsed to dynamically include & exclude relationships
   * @return                         Promise that resolves to transformed JSON.
   */

  /**
   * Method to get transformed time stamps from model.
   * @param   {object}  serializedData  Object containing the timestamps retrieved from serialized data
   * @return  {object}                  Object containing transformed timestamps
   */
  protected getTransformedTimeStamps(serializedData: {
    created_at: string;
    updated_at: string;
    deleted_at?: string;
  }): object {
    return {
      created_at: DateTime.fromISO(serializedData.created_at)
        .startOf('second')
        .toISO({suppressMilliseconds: true}),
      updated_at: DateTime.fromISO(serializedData.updated_at)
        .startOf('second')
        .toISO({suppressMilliseconds: true}),
      ...(serializedData.deleted_at
        ? {
          deleted_at: DateTime.fromISO(serializedData.deleted_at).startOf('second').toISO({
            suppressMilliseconds: true,
          }),
        }
        : {}),
    };
  }

  /**
   * Method to parse includes & excludes.
   * @param  include    comma-separated string of relationships to be included
   * @param  exclude    comma-separated string of relationships to be excluded
   * @param  requestCtx Request context. If provided, will be used to dynamically parse and include / exclude relationships passed in request inputs.
   * @return            Array of relationships to finally be included
   */
  protected parseInclusions(
    include: string = '',
    exclude: string = '',
    requestCtx?: RequestContract
  ): Array<string> {
    const dynamicExcludes: string = requestCtx?.only(['exclude']).exclude || '';
    const dynamicIncludes: string = requestCtx?.only(['include']).include || '';
    const exclusionSet = new Set([...exclude.split(','), ...dynamicExcludes.split(',')]);
    const parsedInclusions = new Set([
      ...(include ? include.split(',') : []),
      ...dynamicIncludes.split(','),
      ...this.defaultIncludes,
    ]);
    for (let elem of exclusionSet) {
      parsedInclusions.delete(elem);
    }
    const possibleIncludes = new Set([...this.availableIncludes, ...this.defaultIncludes]);
    for (let elem of parsedInclusions) {
      if (!possibleIncludes.has(elem.split('.')[0])) {
        parsedInclusions.delete(elem);
      }
    }
    return [...parsedInclusions];
  }
}

type TransformCollectionOptions = {
  transformMethod?: string;
  include?: string;
  exclude?: string;
  request?: RequestContract;
};

type TransformItemOptions<ThrowError extends boolean> = {
  transformMethod?: string;
  include?: string;
  exclude?: string;
  request?: RequestContract;
  throwError?: ThrowError;
};

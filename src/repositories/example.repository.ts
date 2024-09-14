import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PsqlDsDataSource} from '../datasources';
import {Example, ExampleRelations} from '../models';

export class ExampleRepository extends DefaultCrudRepository<
  Example,
  typeof Example.prototype.id,
  ExampleRelations
> {
  constructor(
    @inject('datasources.psqlDs') dataSource: PsqlDsDataSource,
  ) {
    super(Example, dataSource);
  }
}

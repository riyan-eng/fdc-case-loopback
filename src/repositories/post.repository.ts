import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PsqlDsDataSource} from '../datasources';
import {Post, PostRelations} from '../models';

export class PostRepository extends DefaultCrudRepository<
  Post,
  typeof Post.prototype.id,
  PostRelations
> {
  constructor(
    @inject('datasources.psqlDs') dataSource: PsqlDsDataSource,
  ) {
    super(Post, dataSource);
  }
}

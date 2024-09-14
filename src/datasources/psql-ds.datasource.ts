import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'psqlDs',
  connector: 'postgresql',
  url: 'postgres://postgres:riyan@localhost/case4',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'riyan',
  database: 'case4'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PsqlDsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'psqlDs';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.psqlDs', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

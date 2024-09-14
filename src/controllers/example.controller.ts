import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Example} from '../models';
import {ExampleRepository} from '../repositories';

@authenticate('jwt')
export class ExampleController {
  constructor(
    @repository(ExampleRepository)
    public exampleRepository : ExampleRepository,
  ) {}

  @post('/example')
  @response(200, {
    description: 'Example model instance',
    content: {'application/json': {schema: getModelSchemaRef(Example)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Example, {
            title: 'NewExample',
            exclude: ['id'],
          }),
        },
      },
    })
    example: Omit<Example, 'id'>,
  ): Promise<Example> {
    return this.exampleRepository.create(example);
  }

  @get('/example/count')
  @response(200, {
    description: 'Example model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Example) where?: Where<Example>,
  ): Promise<Count> {
    return this.exampleRepository.count(where);
  }

  @get('/example')
  @response(200, {
    description: 'Array of Example model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Example, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Example) filter?: Filter<Example>,
  ): Promise<Example[]> {
    return this.exampleRepository.find(filter);
  }

  @get('/example/{id}')
  @response(200, {
    description: 'Example model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Example, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Example, {exclude: 'where'}) filter?: FilterExcludingWhere<Example>
  ): Promise<Example> {
    return this.exampleRepository.findById(id, filter);
  }

  @patch('/example/{id}')
  @response(204, {
    description: 'Example PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Example, {partial: true}),
        },
      },
    })
    example: Example,
  ): Promise<void> {
    await this.exampleRepository.updateById(id, example);
  }

  @put('/example/{id}')
  @response(204, {
    description: 'Example PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() example: Example,
  ): Promise<void> {
    await this.exampleRepository.replaceById(id, example);
  }

  @del('/example/{id}')
  @response(204, {
    description: 'Example DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.exampleRepository.deleteById(id);
  }
}

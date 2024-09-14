import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  repository
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
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {v4 as uuidv4} from 'uuid';
import {Post} from '../models';
import {PostRepository} from '../repositories';

const postSchema: SchemaObject = {
  type: 'object',
  required: ['title'],
  properties: {
    title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
  },
};

@authenticate('jwt')
export class PostController {
  constructor(
    @repository(PostRepository)
    public postRepository: PostRepository,
  ) { }

  @post('/post')
  @response(200, {
    description: 'Post model instance',
    content: {'application/json': {schema: getModelSchemaRef(Post)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: postSchema,
        },
      },
    })
    post: Omit<Post, 'id'>,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Post> {
    var userId = currentUserProfile[securityId]
    let myuuid = uuidv4();
    var payload = {
      id: myuuid,
      userid: userId,
      title: post.title,
      description: post.description,
    }
    return this.postRepository.create(payload);
  }

  @get('/post')
  @response(200, {
    description: 'Array of Post model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Post, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.query.string('search') search: string,
    @param.query.integer('offset') offset: number,
    @param.query.integer('limit') limit: number,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Post[]> {
    if (search === undefined) {
      search = ""
    }
    var userId = currentUserProfile[securityId]
    var pattern = "%%" + search + "%%"
    return this.postRepository.find({
      limit: limit,
      offset: offset,
      where: {
        userid: userId,
        title: {
          like: pattern,
        }
      }
    });
  }

  @get('/post/{id}')
  @response(200, {
    description: 'Post model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Post, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
  ): Promise<Post> {
    return this.postRepository.findById(id);
  }

  @patch('/post/{id}')
  @response(204, {
    description: 'Post PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: postSchema,
        },
      },
    })
    post: Post,
  ): Promise<void> {
    await this.postRepository.updateById(id, post);
  }

  @put('/post/{id}')
  @response(204, {
    description: 'Post PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: postSchema,
        },
      },
    })
    post: Post,
  ): Promise<void> {
    post.userid = currentUserProfile[securityId]
    await this.postRepository.replaceById(id, post);
  }

  @del('/post/{id}')
  @response(204, {
    description: 'Post DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.postRepository.deleteById(id);
  }
}

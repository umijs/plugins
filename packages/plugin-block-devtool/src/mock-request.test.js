import request from './mock-request';

describe('mock-request', () => {
  it('mock data right', async () => {
    const ret = await request(
      '/api/test',
      {},
      {
        'GET /api/test': 'testres'
      }
    );
    expect(ret).toEqual('testres');

    const ret2 = await request(
      '/api/test',
      {},
      {
        'GET /api/:id': 'testres2'
      }
    );
    expect(ret2).toEqual('testres2');

    const ret3 = await request(
      '/api/test',
      {
        method: 'post'
      },
      {
        'POST /api/test': () => {
          return 'testres-post';
        },
        'GET /api/test': () => {
          return 'testres3';
        }
      }
    );
    expect(ret3).toEqual('testres-post');

    const ret4 = await request(
      '/api/test',
      {},
      {
        '/api/test': 'testres4'
      }
    );
    expect(ret4).toEqual('testres4');
  });
});

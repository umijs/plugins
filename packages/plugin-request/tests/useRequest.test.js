import createTestServer from 'create-test-server';
import { renderHook } from '@testing-library/react-hooks';
import { request, useRequest } from '../src/request';

jest.mock(
  'runtimeConfig',
  () => {
    return {};
  },
  { virtual: true },
);

describe('normal request', () => {
  let server;

  beforeAll(async () => {
    server = await createTestServer();
  });

  afterAll(() => {
    server.close();
  });

  const prefix = api => `${server.url}${api}`;

  test('success', async () => {
    const rawData = {
      success: true,
      data: {
        text: 'testtext',
      },
      errorMessage: 'test message',
    };
    server.get('/test/success', (req, res) => {
      res.send(rawData);
    });

    const { result, waitForValueToChange } = renderHook(() =>
      useRequest(prefix('/test/success')),
    );
    await waitForValueToChange(() => result.current.data);
    expect(result.current.data).toEqual({
      text: 'testtext',
    });
  });

  test('failed with reqeust', async () => {
    const rawData = {
      success: false,
      data: {
        text: 'testtext',
      },
      errorMessage: 'test message',
    };
    server.get('/test/failed', (req, res) => {
      res.send(rawData);
    });

    const { result, waitForValueToChange } = renderHook(() =>
      useRequest(() => {
        return request(prefix('/test/failed')).catch(e => {
          return { data: e.message };
        });
      }),
    );
    await waitForValueToChange(() => result.current.data);
    expect(result.current.data).toEqual('test message');
  });

  test('failed with url', async () => {
    const rawData = {
      success: false,
      data: {
        text: 'testtext',
      },
      errorMessage: 'test message',
    };
    server.get('/test/failed', (req, res) => {
      res.send(rawData);
    });

    const { result, waitForValueToChange } = renderHook(() =>
      useRequest(prefix('/test/failed')),
    );
    await waitForValueToChange(() => result.current.error);
    expect(result.current.error.message).toEqual('test message');
  });

  test('http errorfailed with url', async () => {
    const rawData = {
      success: true,
      data: {
        text: 'testtext',
      },
      errorMessage: 'test message',
    };
    server.get('/test/httpfailed', (req, res) => {
      res.status(500);
      res.send(rawData);
    });

    const { result, waitForValueToChange } = renderHook(() =>
      useRequest(prefix('/test/httpfailed')),
    );
    await waitForValueToChange(() => result.current.error);
    expect(result.current.error.message).toEqual('test message');
  });
});

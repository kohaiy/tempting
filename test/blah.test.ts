import {
  createTempting,
  createMemoryAdapter,
  createSyncTempting,
  createFileAdapter,
} from '../src';

describe('createTempting', () => {
  const temp = createTempting(createFileAdapter({ dirPath: './.cache' }));
  it('be null', async () => {
    expect(await temp.get('a')).toEqual(null);
  });
  it('be 1', async () => {
    await temp.set('b', 1);
    expect(await temp.get('b')).toEqual(1);
  });
  it('be 3', async () => {
    await temp.set('c', '3', 10);
    expect(await temp.get('c')).toEqual('3');
  });
  it('be null', async () => {
    await temp.set('d', '1', -1);
    expect(await temp.get('d')).toEqual(null);
  });
  it('be obj', async () => {
    await temp.set('e', { e: 1 });
    expect((await temp.get<{ e: number }>('e'))?.e).toEqual(1);
  });
  it('be del', async () => {
    await temp.set('f', '1');
    await temp.del('f');
    expect(await temp.get('f')).toEqual(null);
  });
});

describe('createSyncTempting', () => {
  const temp = createSyncTempting(createMemoryAdapter());
  it('be null', () => {
    expect(temp.get('a')).toEqual(null);
  });
  it('be 1', () => {
    temp.set('b', 1);
    expect(temp.get('b')).toEqual(1);
  });
  it('be 3', () => {
    temp.set('c', '3', 1);
    expect(temp.get('c')).toEqual('3');
  });
  it('be null', () => {
    temp.set('d', '1', -1);
    expect(temp.get('d')).toEqual(null);
  });
  it('be obj', () => {
    temp.set('e', { e: 1 });
    expect(temp.get<{ e: number }>('e')?.e).toEqual(1);
  });
  it('be del', async () => {
    temp.set('f', '1');
    temp.del('f');
    expect(temp.get('f')).toEqual(null);
  });
});

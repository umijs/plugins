import getAccessContent from '../../src/utils/getAccessContent';

const utils = {
  winPath: jest.fn(() => 'test'),
};

describe('getAccessContent', () => {
  it('should return content string when call getAccessContent', () => {
    const result = getAccessContent(utils);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

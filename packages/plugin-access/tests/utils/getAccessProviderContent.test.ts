import getAccessProviderContent from '../../src/utils/getAccessProviderContent';

const utils = {
  winPath: jest.fn(() => 'test'),
};

describe('getAccessProviderContent', () => {
  it('should return content string when call getAccessProviderContent', () => {
    const result = getAccessProviderContent(utils as any);
    expect(utils.winPath).toHaveBeenCalledTimes(1);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

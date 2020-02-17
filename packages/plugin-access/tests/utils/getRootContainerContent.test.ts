import getRootContainerContent from '../../src/utils/getRootContainerContent';

describe('getRootContainerContent', () => {
  it('should return content string when call getRootContainerContent', () => {
    const result = getRootContainerContent();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

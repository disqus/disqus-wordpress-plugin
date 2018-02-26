import { createRandomToken, getForumAdminUrl } from '../src/ts/utils';

test('getForumAdminUrl returns fully qualified URL', () => {
    expect(getForumAdminUrl('foo', 'settings')).toBe('https://foo.disqus.com/admin/settings/');
});

test('createRandomToken returns a token containing specified number of characters', () => {
    const token = createRandomToken(32);

    expect(token.length).toBe(32);
    expect(token.match(/[a-z0-9]/));
});

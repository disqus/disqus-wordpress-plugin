import { getForumAdminUrl } from '../src/ts/utils';

test('getForumAdminUrl returns fully qualified URL', () => {
    expect(getForumAdminUrl('foo', 'settings')).toBe('https://foo.disqus.com/admin/settings/');
});

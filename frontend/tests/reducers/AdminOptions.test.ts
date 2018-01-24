import AdminOptions from '../../src/ts/reducers/AdminOptions';

describe('AdminOptions', () => {

    test('Constructor populates values', () => {
        const adminOptions: AdminOptions = new AdminOptions({
            disqus_forum_url: 'foo',
        });

        expect(adminOptions.disqus_forum_url).toBe('foo');
        expect(adminOptions.disqus_public_key).toBeNull();
    });

    test('Immutable.Record functions are implemented', () => {
        const adminOptions: AdminOptions = new AdminOptions();

        expect(adminOptions.set('disqus_forum_url', 'foo').disqus_forum_url).toBe('foo');

        expect(adminOptions.with({
            disqus_forum_url: 'bar',
        }).disqus_forum_url).toBe('bar');
    });

});

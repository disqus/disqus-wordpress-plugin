import AdminState from '../../src/ts/reducers/AdminState';

declare var global: any

describe('AdminState', () => {

    test('Constructor populates default values', () => {
        const adminState: AdminState = new AdminState(global.DISQUS_WP);

        expect(adminState.config).toEqual(global.DISQUS_WP);
        expect(adminState.exportLogs.count()).toBe(0);
    });

    test('Immutable.Record functions are implemented', () => {
        const adminState: AdminState = new AdminState(global.DISQUS_WP);

        expect(adminState.set('activeTab', 'foo').activeTab).toBe('foo');

        expect(adminState.with({
            activeTab: 'bar',
        }).activeTab).toBe('bar');
    });

});

import SyncStatus from '../../src/ts/reducers/SyncStatus';

describe('SyncStatus', () => {

    test('Constructor populates values', () => {
        const syncStatus: SyncStatus = new SyncStatus({
            enabled: true,
        });

        expect(syncStatus.enabled).toBe(true);
        expect(syncStatus.last_message).toBeNull();
    });

    test('Immutable.Record functions are implemented', () => {
        const syncStatus: SyncStatus = new SyncStatus();

        expect(syncStatus.set('last_message', 'foo').last_message).toBe('foo');

        expect(syncStatus.with({
            last_message: 'bar',
        }).last_message).toBe('bar');
    });

});

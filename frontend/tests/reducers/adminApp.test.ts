
import * as actions from '../../src/ts/actions';
import { IAction } from '../../src/ts/actions';
import adminApp from '../../src/ts/reducers/adminApp';
import AdminState, {
    ExportLogStaus,
    IExportPostLog,
    IMessage,
    InstallationState,
} from '../../src/ts/reducers/AdminState';
import SyncStatus from '../../src/ts/reducers/SyncStatus';

describe('adminApp reducer', () => {

    test('changeInstallStateAction updates the installationState', () => {
        const action: IAction = actions.changeInstallStateAction(InstallationState.installed);

        const newState: AdminState = adminApp(undefined, action);

        expect(newState.installationState).toBe(InstallationState.installed);
    });

    test('changeTabStateAction updates the activeTab', () => {
        const action: IAction = actions.changeTabStateAction('foo');

        const newState: AdminState = adminApp(undefined, action);

        expect(newState.activeTab).toBe('foo');
    });

    test('setMessageAction updates the message', () => {
        const message: IMessage = {
            text: 'foo',
            type: 'bar',
         };
        const action: IAction = actions.setMessageAction(message);

        const newState: AdminState = adminApp(undefined, action);

        expect(newState.message).toBe(message);
    });

    test('setValueAction updates any value', () => {
        const action: IAction = actions.setValueAction('isFetchingAdminOptions', true);

        const newState: AdminState = adminApp(undefined, action);

        expect(newState.isFetchingAdminOptions).toBe(true);
    });

    test('toggleValueAction changes a boolean value', () => {
        const action1: IAction = actions.toggleValueAction('isSiteFormLocked');

        const newState1: AdminState = adminApp(undefined, action1);

        expect(newState1.isSiteFormLocked).toBe(false);

        const action2: IAction = actions.toggleValueAction('isSiteFormLocked');

        const newState2: AdminState = adminApp(newState1, action2);

        expect(newState2.isSiteFormLocked).toBe(true);
    });

    test('updateAdminOptionsAction updates adminOptions', () => {
        const action: IAction = actions.updateAdminOptionsAction({
            disqus_forum_url: 'foo',
        });

        const newState: AdminState = adminApp(undefined, action);

        expect(newState.adminOptions.disqus_forum_url).toBe('foo');
    });

    test('updateExportPostLogAction updates exportLogs', () => {
        const postLog1: IExportPostLog = {
            id: 1,
            link: 'https://foo.com?p=1',
            status: ExportLogStaus.pending,
            title: 'Test Title',
        };

        const action1: IAction = actions.updateExportPostLogAction(postLog1);

        const newState1: AdminState = adminApp(undefined, action1);

        expect(newState1.exportLogs.get(1)).toBe(postLog1);

        const postLog2: IExportPostLog = {
            id: 1,
            link: 'https://foo.com?p=1',
            numComments: 10,
            status: ExportLogStaus.complete,
            title: 'Test Title',
        };

        const action2: IAction = actions.updateExportPostLogAction(postLog2);

        const newState2: AdminState = adminApp(newState1, action2);

        expect(newState2.exportLogs.get(1)).toBe(postLog2);
    });

    test('updateLocalOptionAction updates localAdminOptions', () => {
        const action: IAction = actions.updateLocalOptionAction('disqus_forum_url', 'foo');

        const newState: AdminState = adminApp(undefined, action);

        expect(newState.localAdminOptions.disqus_forum_url).toBe('foo');
    });

    test('updateSyncStatusAction updates syncStatus', () => {
        const syncStatus: SyncStatus = new SyncStatus({
            enabled: true,
            last_message: 'foo',
            requires_update: false,
            subscribed: true,
            subscription: 1,
        });

        const action: IAction = actions.updateSyncStatusAction(syncStatus);

        const newState: AdminState = adminApp(undefined, action);

        expect(newState.syncStatus).toEqual(syncStatus);
    });

});

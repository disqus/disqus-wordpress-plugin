import * as actions from '../src/ts/actions';
import { ExportLogStaus, IExportPostLog, IMessage, InstallationState } from '../src/ts/reducers/AdminState';

test('updateAdminOptionsAction creates an action to update the admin options', () => {
    const newAdminOptions: any = {
        test_option: true,
    };

    const expectedAction: any = {
        data: {
            test_option: true,
        },
        type: 'UPDATE_ADMIN_OPTIONS',
    };

    expect(actions.updateAdminOptionsAction(newAdminOptions)).toEqual(expectedAction);
});

test('updateLocalOptionAction creates an action to update the local options', () => {
    const expectedAction: any = {
        data: {
            test_option: 'foo',
        },
        type: 'UPDATE_LOCAL_OPTION',
    };

    expect(actions.updateLocalOptionAction('test_option', 'foo')).toEqual(expectedAction);
});

test('updateSyncStatusAction creates an action to update the sync status', () => {
    const newSyncStatus: any = {
        sync_status: 'sync',
    };

    const expectedAction: any = {
        data: {
            sync_status: 'sync',
        },
        type: 'UPDATE_SYNC_STATUS',
    };

    expect(actions.updateSyncStatusAction(newSyncStatus)).toEqual(expectedAction);
});

test('toggleValueAction creates an action to toggle a value', () => {
    const expectedAction: any = {
        data: 'foo',
        type: 'TOGGLE_VALUE',
    };

    expect(actions.toggleValueAction('foo')).toEqual(expectedAction);
});

test('setValueAction creates an action to set a value', () => {
    const expectedAction: any = {
        data: {
            test: 'foo',
        },
        type: 'SET_VALUE',
    };

    expect(actions.setValueAction('test', 'foo')).toEqual(expectedAction);
});

test('setMessageAction creates an action to update the message', () => {
    const message: IMessage = {
        text: 'Test message',
        type: 'error',
    };

    const expectedAction: any = {
        data: {
            text: 'Test message',
            type: 'error',
        },
        type: 'SET_MESSAGE',
    };

    expect(actions.setMessageAction(message)).toEqual(expectedAction);
});

test('changeInstallStateAction creates an action to update the install state', () => {
    const state: InstallationState = InstallationState.none;

    const expectedAction: any = {
        data: InstallationState.none,
        type: 'CHANGE_INSTALL_STATE',
    };

    expect(actions.changeInstallStateAction(state)).toEqual(expectedAction);
});

test('changeTabStateAction creates an action to change a tab state', () => {
    const expectedAction: any = {
        data: 'footab',
        type: 'CHANGE_TAB_STATE',
    };

    expect(actions.changeTabStateAction('footab')).toEqual(expectedAction);
});

test('updateExportPostLogAction creates an action to change update a post log', () => {
    const postLog: IExportPostLog = {
        id: 1,
        link: 'https://foo.com',
        status: ExportLogStaus.pending,
        title: 'Foo',
    };

    const expectedAction: any = {
        data: {
            id: 1,
            link: 'https://foo.com',
            status: ExportLogStaus.pending,
            title: 'Foo',
        },
        type: 'UPDATE_EXPORT_POST_LOG',
    };

    expect(actions.updateExportPostLogAction(postLog)).toEqual(expectedAction);
});

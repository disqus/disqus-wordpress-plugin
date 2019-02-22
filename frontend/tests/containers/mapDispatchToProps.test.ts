import * as Redux from 'redux';
import {
    changeInstallStateAction,
    IAction,
    toggleValueAction,
    updateLocalOptionAction,
} from '../../src/ts/actions';
import mapDispatchToProps, { UPDATABLE_FIELDS } from '../../src/ts/containers/mapDispatchToProps';
import { InstallationState } from '../../src/ts/reducers/AdminState';
import WordPressCommentExporter from '../../src/ts/WordPressCommentExporter';
import { WordPressRestApi } from '../../src/ts/WordPressRestApi';

declare var global: any

jest.mock('../../src/ts/WordPressCommentExporter');

describe('containers/mapDispatchToProps', () => {

    test('onCopyText copies text to the clipboard', () => {
        const mockDocumentExecCommand = jest.fn();
        const mockElementSelect = jest.fn();
        const mockGetElementById = jest.fn((id: string) => ({
            select: mockElementSelect,
        }));
        global.document.getElementById = mockGetElementById;
        global.document.execCommand = mockDocumentExecCommand;

        const props: any = mapDispatchToProps(jest.fn());

        props.onCopyText('foo');

        expect(mockGetElementById).toHaveBeenCalledWith('foo');
        expect(mockElementSelect).toHaveBeenCalled();
        expect(mockDocumentExecCommand).toHaveBeenCalledWith('copy');
    });

    test('onInputChange dispatches updateLocalOptionAction', () => {
        const mockDispatch: Redux.Dispatch<Redux.Action> = jest.fn((action: Redux.Action) => null);

        const props: any = mapDispatchToProps(mockDispatch);

        props.onInputChange('disqus_forum_url', {
            currentTarget: {
                type: 'text',
                value: 'foo',
            },
        });

        const expectedAction: IAction = updateLocalOptionAction('disqus_forum_url', 'foo');

        expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });

    test('onSubmitExportCommentsForm starts an export', () => {
        const mockDispatch: Redux.Dispatch<Redux.Action> = jest.fn((action: Redux.Action) => null);
        const props: any = mapDispatchToProps(mockDispatch);
        const mockPreventDefault: jest.EmptyFunction = jest.fn();

        props.onSubmitExportCommentsForm({
            preventDefault: mockPreventDefault,
        });

        expect(mockPreventDefault).toHaveBeenCalled();
        expect(WordPressCommentExporter).toHaveBeenCalledTimes(1);
        expect(WordPressCommentExporter).toHaveBeenLastCalledWith(mockDispatch);
    });

    test('onSubmitSiteForm submits fields to the REST API', () => {
        const mockDispatch: Redux.Dispatch<Redux.Action> = jest.fn();
        const props: any = mapDispatchToProps(mockDispatch);
        const mockPreventDefault: jest.EmptyFunction = jest.fn();

        WordPressRestApi.instance.pluginRestPost = jest.fn();

        const elements: any = {
            disqus_forum_url: {
                name: 'disqus_forum_url',
                type: 'text',
                value: 'foo',
            },
            disqus_sso_enabled: {
                checked: true,
                name: 'disqus_sso_enabled',
                type: 'checkbox',
            },
            namedItem: jest.fn((id: string) => elements[id]),
        };

        props.onSubmitSiteForm({
            currentTarget: {
                elements,
            },
            preventDefault: mockPreventDefault,
        });

        expect(mockPreventDefault).toHaveBeenCalled();

        const expectedFields: any = {
            disqus_forum_url: 'foo',
            disqus_sso_enabled: '1',
        };

        expect(WordPressRestApi.instance.pluginRestPost).toHaveBeenCalledTimes(1);
        expect((WordPressRestApi.instance.pluginRestPost as jest.Mock).mock.calls[0][0]).toBe('settings');
        expect((WordPressRestApi.instance.pluginRestPost as jest.Mock).mock.calls[0][1]).toEqual(expectedFields);
    });

    test('onSubmitSyncConfigForm submits to the REST API', () => {
        const mockDispatch: Redux.Dispatch<Redux.Action> = jest.fn();
        const props: any = mapDispatchToProps(mockDispatch);
        const mockPreventDefault: jest.EmptyFunction = jest.fn();

        WordPressRestApi.instance.pluginRestPost = jest.fn();

        props.onSubmitSyncConfigForm({
            currentTarget: {
                name: 'sync',
            },
            preventDefault: mockPreventDefault,
        });

        expect(mockPreventDefault).toHaveBeenCalled();

        expect(WordPressRestApi.instance.pluginRestPost).toHaveBeenCalledTimes(1);
        expect((WordPressRestApi.instance.pluginRestPost as jest.Mock).mock.calls[0][0]).toBe('sync');
        expect((WordPressRestApi.instance.pluginRestPost as jest.Mock).mock.calls[0][1]).toEqual(null);
    });

    test('onToggleState dispatches toggleValueAction', () => {
        const mockDispatch: Redux.Dispatch<Redux.Action> = jest.fn((action: Redux.Action) => null);
        const props: any = mapDispatchToProps(mockDispatch);

        props.onToggleState('foo');

        const expectedAction: IAction = toggleValueAction('foo');

        expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    });

    test('onUpdateInstallationState dispatches changeInstallStateAction', () => {
        const mockDispatch: Redux.Dispatch<Redux.Action> = jest.fn((action: Redux.Action) => null);
        const props: any = mapDispatchToProps(mockDispatch);

        props.onUpdateInstallationState(InstallationState.installed);

        expect(mockDispatch).toHaveBeenCalledWith(changeInstallStateAction(InstallationState.installed));

        props.onUpdateInstallationState(InstallationState.none);

        expect(mockDispatch).toHaveBeenCalledWith(changeInstallStateAction(InstallationState.none));
    });

});

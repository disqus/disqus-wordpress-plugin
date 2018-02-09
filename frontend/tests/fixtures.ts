import { IFormProps } from '../src/ts/components/FormProps';
import AdminState, { IAdminConfigData } from '../src/ts/reducers/AdminState';

export const getDefaultAdminConfig = (): IAdminConfigData => ({
    adminUrls: {
        disqus: 'https://foo.com/wp-admin/admin.php?page=disqus',
        editComments: 'https://foo.com/wp-admin/edit-comments.php',
    },
    permissions: {
        canManageSettings: true,
    },
    rest: {
        base: 'https://foo.com/wp-json/',
        disqusBase: 'disqus/v1/',
        nonce: 'foo',
    },
    site: {
        allPlugins: {},
        name: 'Test',
        pluginVersion: '0.0.1',
    },
});

export const getDefaultFormProps = (): IFormProps => ({
    data: new AdminState(getDefaultAdminConfig()),
    onCopyText: jest.fn(),
    onInputChange: jest.fn(),
    onSubmitExportCommentsForm: jest.fn(),
    onSubmitSiteForm: jest.fn(),
    onSubmitSyncConfigForm: jest.fn(),
    onToggleState: jest.fn(),
    onUpdateInstallationState: jest.fn(),
});

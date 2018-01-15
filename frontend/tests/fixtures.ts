import { IFormProps } from '../src/ts/components/FormProps';
import AdminState, { IAdminConfigData } from '../src/ts/reducers/AdminState';

const DEFAULT_ADMIN_CONFIG: IAdminConfigData = {
    adminUrls: {
        disqus: '/',
        editComments: '/',
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
        name: 'Test',
        pluginVersion: '0.0.1',
    },
};

export const DEFAULT_FORM_PROPS: IFormProps = {
    data: new AdminState(DEFAULT_ADMIN_CONFIG),
    onCopyText: jest.fn(),
    onInputChange: jest.fn(),
    onSubmitExportCommentsForm: jest.fn(),
    onSubmitSiteForm: jest.fn(),
    onSubmitSyncConfigForm: jest.fn(),
    onToggleState: jest.fn(),
    onUpdateInstallationState: jest.fn(),
};

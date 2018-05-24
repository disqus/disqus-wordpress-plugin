import * as Immutable from 'immutable';
import { IAction } from '../actions';
import * as actions from '../actions';
import AdminOptions from './AdminOptions';
import AdminState, {
    ExportLogStaus,
    IAdminConfigData,
    IDisqusWordpressWindow,
    IExportPostLog,
    InstallationState,
} from './AdminState';

const adminConfigData: IAdminConfigData = (window as IDisqusWordpressWindow).DISQUS_WP;

const initialState: AdminState = new AdminState(adminConfigData);

const adminApp = (state: AdminState = initialState, action: IAction): AdminState => {
    switch (action.type) {
        case actions.UPDATE_ADMIN_OPTIONS:
            state = state.with({
                adminOptions: state.adminOptions.with(action.data),
                localAdminOptions: state.localAdminOptions.with(action.data),
            });
            break;
        case actions.UPDATE_SYNC_STATUS:
            state = state.with({
                syncStatus: state.syncStatus.with(action.data),
            });
            break;
        case actions.SET_MESSAGE:
            state = state.set('message', action.data);
            break;
        case actions.SET_VALUE:
            state = state.with(action.data);
            break;
        case actions.TOGGLE_VALUE:
            const currentValue: boolean = state.get(action.data, false);
            state = state.with({
                [action.data]: !currentValue,
            });
            break;
        case actions.UPDATE_LOCAL_OPTION:
            state = state.with({
                localAdminOptions: state.localAdminOptions.with(action.data),
            });
            break;
        case actions.CHANGE_INSTALL_STATE:
            state = state.with({
                installationState: action.data,
            });
            break;
        case actions.CHANGE_TAB_STATE:
            state = state.with({
                activeTab: action.data,
                installationState: state.adminOptions.disqus_installed ?
                    InstallationState.installed :
                    InstallationState.none,
            });
            break;
        case actions.UPDATE_EXPORT_POST_LOG:
            const newLogs = state.exportLogs.set(action.data.id, action.data);
            state = state.with({
                exportLogs: newLogs,
                isExportRunning: Boolean(newLogs.find((value: IExportPostLog, key: any) => {
                    return value.status === ExportLogStaus.pending;
                })),
            });
            break;
        default:
            break;
    }

    return state;
};

export default adminApp;

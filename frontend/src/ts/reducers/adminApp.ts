import * as Immutable from 'immutable';
import { IAction } from '../actions';
import * as actions from '../actions';
import AdminState from './AdminState';
import { IAdminConfigData, IDisqusWordpressWindow } from './AdminState';

const adminConfigData: IAdminConfigData = (window as IDisqusWordpressWindow).DISQUS_WP;

const initialState: Immutable.Map<any, any> = Immutable.Map(new AdminState(adminConfigData));

const adminApp = (state: AdminState, action: IAction): AdminState => {
    const newState: Immutable.Map<any, any> = Immutable.Map(state || initialState);
    switch (action.type) {
        case actions.UPDATE_ADMIN_OPTIONS:
            return newState.set('adminOptions', action.data)
                           .set('localAdminOptions', action.data)
                           .toObject() as AdminState;
        case actions.SET_MESSAGE:
            return newState.set('message', action.data)
                           .toObject() as AdminState;
        case actions.TOGGLE_LOCAL_OPTION:
            return newState.set(action.data, !newState.get(action.data))
                           .toObject() as AdminState;
        case actions.UPDATE_LOCAL_OPTION:
            return newState.set(action.data.key, action.data.value)
                           .toObject() as AdminState;
        default:
            return newState.toObject() as AdminState;
    }
};

export default adminApp;

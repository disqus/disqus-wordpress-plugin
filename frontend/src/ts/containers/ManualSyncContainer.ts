import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import ManualSyncForm from '../components/ManualSyncForm';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const ManualSyncContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(ManualSyncForm);

export default ManualSyncContainer;

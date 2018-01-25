import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import SyncConfigForm from '../components/SyncConfigForm';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const SyncConfigContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SyncConfigForm);

export default SyncConfigContainer;

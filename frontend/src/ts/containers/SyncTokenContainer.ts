import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import SyncTokenForm from '../components/SyncTokenForm';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const SyncTokenContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SyncTokenForm);

export default SyncTokenContainer;

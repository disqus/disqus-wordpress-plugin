import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import SupportDiagnostics from '../components/SupportDiagnostics';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const SupportDiagnosticsContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SupportDiagnostics);

export default SupportDiagnosticsContainer;

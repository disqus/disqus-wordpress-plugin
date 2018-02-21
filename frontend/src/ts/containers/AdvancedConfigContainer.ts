import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import AdvancedConfigForm from '../components/AdvancedConfigForm';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const AdvancedConfigContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(AdvancedConfigForm);

export default AdvancedConfigContainer;

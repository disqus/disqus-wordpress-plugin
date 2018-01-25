import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import SiteConfigForm from '../components/SiteConfigForm';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const SiteConfigContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(SiteConfigForm);

export default SiteConfigContainer;

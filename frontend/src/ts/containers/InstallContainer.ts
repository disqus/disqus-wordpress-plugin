import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import Install from '../components/Install';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const InstallContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(Install);

export default InstallContainer;

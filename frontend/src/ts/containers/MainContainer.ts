import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import Main from '../components/Main';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const MainContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(Main);

export default MainContainer;

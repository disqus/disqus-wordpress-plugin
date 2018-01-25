import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import ExportComments from '../components/ExportComments';
import mapDispatchToProps from './mapDispatchToProps';
import mapStateToProps from './mapStateToProps';

const ExportCommentsContainer = ReactRedux.connect(
    mapStateToProps,
    mapDispatchToProps,
)(ExportComments);

export default ExportCommentsContainer;

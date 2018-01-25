import AdminState from '../reducers/AdminState';

const mapStateToProps = (state: AdminState) => {
    return {
        data: state,
    };
};

export default mapStateToProps;

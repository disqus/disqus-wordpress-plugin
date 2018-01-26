import { IFormProps } from '../../src/ts/components/FormProps';
import mapStateToProps from '../../src/ts/containers/mapStateToProps';
import AdminState from '../../src/ts/reducers/AdminState';

describe('containers/mapStateToProps', () => {

    test('returns the expected props shape', () => {
        const adminState: AdminState = new AdminState(global.DISQUS_WP);
        const props: any = mapStateToProps(adminState);

        expect(props.data).toEqual(adminState);
    });

});

import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { IFormProps } from '../../src/ts/components/FormProps';
import SSOConfigForm from '../../src/ts/components/SSOConfigForm';
import { getDefaultFormProps } from '../fixtures';

describe('SSOConfigForm component', () => {
    test('Renders basic form', () => {
        const props: IFormProps = getDefaultFormProps();
        const component = TestRenderer.create(<SSOConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders form with values', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.with({
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_sso_button: 'https://foo.com/sso.png',
                disqus_sso_enabled: true,
            }),
        });
        const component = TestRenderer.create(<SSOConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('onInputChange prop gets called when values change', () => {
        const props: IFormProps = getDefaultFormProps();
        const onInputChange = props.onInputChange = jest.fn();
        props.data = props.data.with({
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_sso_button: 'https://foo.com/sso.png',
                disqus_sso_enabled: true,
            }),
        });
        const component = TestRenderer.create(<SSOConfigForm {...props} />);
        const root = component.root;

        root.findAllByType('input').forEach((input: any) => {
            if (input.props.type !== 'submit') {
                input.props.onChange.call(null, { foo: 'bar' });
                expect(onInputChange).toHaveBeenLastCalledWith(input.props.id, { foo: 'bar' });
            }
        });
    });

    test('Submitting the form calls onSubmitSiteForm prop', () => {
        const props: IFormProps = getDefaultFormProps();
        const onSubmitSiteForm = props.onSubmitSiteForm = jest.fn();
        props.data = props.data.with({
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_sso_button: 'https://foo.com/sso.png',
                disqus_sso_enabled: true,
            }),
        });
        const component = TestRenderer.create(<SSOConfigForm {...props} />);
        const root = component.root;

        const form = root.findByType('form');
        form.props.onSubmit();

        expect(onSubmitSiteForm).toHaveBeenCalled();
    });
});

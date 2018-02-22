import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import AdvancedConfigForm from '../../src/ts/components/AdvancedConfigForm';
import { IFormProps } from '../../src/ts/components/FormProps';
import { getDefaultFormProps } from '../fixtures';

describe('AdvancedConfigForm component', () => {
    test('Renders basic form', () => {
        const props: IFormProps = getDefaultFormProps();
        const component = TestRenderer.create(<AdvancedConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders form with values', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.with({
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_render_js: true,
            }),
        });
        const component = TestRenderer.create(<AdvancedConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('onInputChange prop gets called when values change', () => {
        const props: IFormProps = getDefaultFormProps();
        const onInputChange = props.onInputChange = jest.fn();
        props.data = props.data.with({
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_render_js: true,
            }),
        });
        const component = TestRenderer.create(<AdvancedConfigForm {...props} />);
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
                disqus_render_js: true,
            }),
        });
        const component = TestRenderer.create(<AdvancedConfigForm {...props} />);
        const root = component.root;

        const form = root.findByType('form');
        form.props.onSubmit();

        expect(onSubmitSiteForm).toHaveBeenCalled();
    });
});

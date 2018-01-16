import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { IFormProps } from '../../src/ts/components/FormProps';
import SiteConfigForm from '../../src/ts/components/SiteConfigForm';
import { getDefaultFormProps } from '../fixtures';

describe('SiteConfigForm component', () => {
    test('Renders basic form', () => {
        const props: IFormProps = getDefaultFormProps();
        const component = TestRenderer.create(<SiteConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders form with save button unlocked', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('isSiteFormLocked', false);
        const component = TestRenderer.create(<SiteConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders form with values', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.with({
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_admin_access_token: 'qux',
                disqus_forum_url: 'foo',
                disqus_public_key: 'bar',
                disqus_secret_key: 'baz',
            }),
        });
        const component = TestRenderer.create(<SiteConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('onInputChange prop gets called when values change', () => {
        const props: IFormProps = getDefaultFormProps();
        const onInputChange = props.onInputChange = jest.fn();
        props.data = props.data.with({
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_admin_access_token: 'qux',
                disqus_forum_url: 'foo',
                disqus_public_key: 'bar',
                disqus_secret_key: 'baz',
            }),
        });
        const component = TestRenderer.create(<SiteConfigForm {...props} />);
        const root = component.root;

        root.findAllByType('input').forEach((input: any) => {
            input.props.onChange.call(null, { foo: 'bar' });
            expect(onInputChange).toHaveBeenLastCalledWith(input.props.id, { foo: 'bar' });
        });
    });

    test('Submitting the form calls onSubmitSiteForm prop', () => {
        const props: IFormProps = getDefaultFormProps();
        const onSubmitSiteForm = props.onSubmitSiteForm = jest.fn();
        props.data = props.data.with({
            isSiteFormLocked: false,
            localAdminOptions: props.data.localAdminOptions.with({
                disqus_admin_access_token: 'qux',
                disqus_forum_url: 'foo',
                disqus_public_key: 'bar',
                disqus_secret_key: 'baz',
            }),
        });
        const component = TestRenderer.create(<SiteConfigForm {...props} />);
        const root = component.root;

        const form = root.findByType('form');
        form.props.onSubmit();

        expect(onSubmitSiteForm).toHaveBeenCalled();
    });
});

import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import { IFormProps } from '../../src/ts/components/FormProps';
import SyncConfigForm from '../../src/ts/components/SyncConfigForm';
import { getDefaultFormProps } from '../fixtures';

describe('SyncConfigForm component', () => {
    test('Renders form with no sync enabled', () => {
        const props: IFormProps = getDefaultFormProps();
        const component = TestRenderer.create(<SyncConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders form with disabled sync subscription', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.with({
            syncStatus: props.data.syncStatus.with({
                subscribed: false,
            }),
        });
        const component = TestRenderer.create(<SyncConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders form with paused sync subscription', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.with({
            syncStatus: props.data.syncStatus.with({
                requires_update: true,
                subscribed: true,
            }),
        });
        const component = TestRenderer.create(<SyncConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders form with enabled sync subscription', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.with({
            syncStatus: props.data.syncStatus.with({
                enabled: true,
                subscribed: true,
            }),
        });
        const component = TestRenderer.create(<SyncConfigForm {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Submitting the form calls onSubmitSyncConfigForm prop', () => {
        const props: IFormProps = getDefaultFormProps();
        const onSubmitSyncConfigForm = props.onSubmitSyncConfigForm = jest.fn();
        props.data = props.data.with({
            syncStatus: props.data.syncStatus.with({
                subscribed: false,
            }),
        });
        const component = TestRenderer.create(<SyncConfigForm {...props} />);
        const root = component.root;

        const form = root.findByType('form');
        form.props.onSubmit();

        expect(onSubmitSyncConfigForm).toHaveBeenCalled();
    });
});

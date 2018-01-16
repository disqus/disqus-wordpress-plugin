import * as React from 'react';
import * as TestRenderer from 'react-test-renderer';
import ExportComments, { LogMessages } from '../../src/ts/components/ExportComments';
import { IFormProps } from '../../src/ts/components/FormProps';
import { ExportLogStaus, IExportPostLog } from '../../src/ts/reducers/AdminState';
import { getDefaultFormProps } from '../fixtures';

describe('ExportComments component', () => {
    test('Renders basic form without any export logs', () => {
        const props: IFormProps = getDefaultFormProps();
        const component = TestRenderer.create(<ExportComments {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Disables submit button during export', () => {
        const props: IFormProps = getDefaultFormProps();
        props.data = props.data.set('isExportRunning', true);

        const component = TestRenderer.create(<ExportComments {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });

    test('Renders export logs', () => {
        const props: IFormProps = getDefaultFormProps();
        const exportLog: IExportPostLog = {
            id: 1,
            link: 'https://foo.com?p=1',
            status: ExportLogStaus.pending,
            title: 'Foo',
        };
        props.data = props.data.with({
            exportLogs: props.data.exportLogs.set(exportLog.id, exportLog),
            isExportRunning: true,
        });

        const component = TestRenderer.create(<ExportComments {...props} />);

        expect(component.toJSON()).toMatchSnapshot();
    });
});

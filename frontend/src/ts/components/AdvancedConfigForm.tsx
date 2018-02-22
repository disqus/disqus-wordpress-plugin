import * as React from 'react';
import { IFormProps } from './FormProps';

/* tslint:disable:max-line-length */
const AdvancedConfigForm = (props: IFormProps) => (
    <form name='advanced' action='' method='POST' onSubmit={props.onSubmitSiteForm}>
        <table className='form-table'>
            <tbody>
                <tr>
                    <th scope='row'>
                        <label htmlFor='disqus_render_js'>
                            {__('Render Comments JavaScript')}
                        </label>
                    </th>
                    <td>
                        <input
                            type='checkbox'
                            id='disqus_render_js'
                            name='disqus_render_js'
                            checked={Boolean(props.data.localAdminOptions.get('disqus_render_js'))}
                            onChange={props.onInputChange.bind(null, 'disqus_render_js')}
                        />
                        <p className='description'>
                            {__('This will render the Disqus comments javascript directly into the page markup, rather than use the wp_enqueue_script() function. Enable this if Disqus doesn\'t load on your posts.')}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p className='submit'>
            <input
                type='submit'
                name='submit-application-form'
                className='button button-primary'
                value={__('Save')}
            />
        </p>
    </form>
);
/* tslint:enable:max-line-length */

export default AdvancedConfigForm;

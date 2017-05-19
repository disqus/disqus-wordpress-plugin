import * as React from 'react';
import { IMessage } from '../reducers/AdminState';

const getDismissButton = (props: IMessage) => {
    if (!props.onDismiss)
        return null;

    return (
        <button type="button" className="notice-dismiss" onClick={props.onDismiss}>
            <span className="screen-reader-text">Dismiss this notice.</span>
        </button>
    );
};

const Message = (props: IMessage) => (
    <div className={`notice notice-${props.type} inline is-dismissible`}>
        <p>{props.text}</p>
        {getDismissButton(props)}
    </div>
);

export default Message;

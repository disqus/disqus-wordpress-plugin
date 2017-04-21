import * as React from 'react';
import { IMessage } from '../reducers/AdminState';

const Message = (props: IMessage) => (
    <div className={`notice notice-${props.type} inline is-dismissible`}>
        <p>{props.text}</p>
    </div>
);

export default Message;

import * as React from 'react';

export interface MessageProps {
    text: string,
    type: string,
}

const Message = (props: MessageProps) =>
    <div className={`notice notice-${props.type} inline is-dismissible`}>
        <p>{props.text}</p>
    </div>;

export default Message;

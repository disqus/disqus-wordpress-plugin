import React from 'react';

const Message = props =>
    <div className={`notice notice-${props.type} inline is-dismissible`}>
        <p>{props.children}</p>
    </div>;

export default Message;

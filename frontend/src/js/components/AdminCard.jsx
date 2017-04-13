import React from 'react';

const AdminCard = props =>
    <div className="card">
        {props.title ?
            <h2 className="title">
                {props.title}
            </h2>
        : null}
        {props.children}
    </div>;

export default AdminCard;

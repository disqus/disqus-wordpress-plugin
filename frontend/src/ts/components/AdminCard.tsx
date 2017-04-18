import * as React from 'react';

export interface AdminCardProps {
    children?: React.ReactChildren,
    title: string,
}

const AdminCard = (props: AdminCardProps) =>
    <div className="card">
        {props.title ?
            <h2 className="title">
                {props.title}
            </h2>
        : null}
        {props.children}
    </div>;

export default AdminCard;

import * as React from 'react';

export interface IAdminCardProps {
    children?: Element[];
    title: string;
}

const AdminCard = (props: IAdminCardProps) => (
    <div className="card">
        {props.title ? <h2 className="title">{props.title}</h2> : null}
        {props.children}
    </div>
);

export default AdminCard;

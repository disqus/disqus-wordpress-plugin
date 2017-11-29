import * as React from 'react';

export interface IAdminCardProps {
    children?: any;
    title: string;
}

const AdminCard = (props: IAdminCardProps) => (
    <div className='card dsq-card'>
        {props.title ? <h2 className='title'>{props.title}</h2> : null}
        {props.children}
    </div>
);

export default AdminCard;

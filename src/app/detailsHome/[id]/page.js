


import React from 'react';
import DetailsPage from '@/components/DetailsHome';
import AddPhoto from '@/components/AddPhoto';
const DetailHome = ({params}) => {
    const { id } = params;
    return (
        <div>
            <h1>DetailHome {id}</h1>
            <AddPhoto />
            <DetailsPage />
        </div>
    );
};

export default DetailHome;
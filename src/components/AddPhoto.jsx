
import Image from 'next/image';
import React from 'react';
 
const AddPhoto = () => {
    return (
        <div className='md:flex mt-8 items-center justify-between container'>
          
            <div className=''>
                <Image src="/images/adds.png" className='h-44 md:h-60 md:w-[700px]' width={500} height={600} alt="add photo" />
            </div>
            <div>
            <Image src="/images/adds.png" className='h-44 md:h-60 md:w-[700px]' width={500} height={600} alt="add photo" />
            </div>
        </div>
    );
};

export default AddPhoto;
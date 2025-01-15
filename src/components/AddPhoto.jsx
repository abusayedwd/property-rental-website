
import Image from 'next/image';
import React from 'react';
 
const AddPhoto = () => {
    return (
        <div className='flex mt-8 items-center justify-between container'>
          
            <div>
                <Image src="/images/adds.png" className='h-60 w-[700px]' width={500} height={600} alt="add photo" />
            </div>
            <div>
            <Image src="/images/adds.png" className='h-60 w-[700px]' width={500} height={600} alt="add photo" />
            </div>
        </div>
    );
};

export default AddPhoto;
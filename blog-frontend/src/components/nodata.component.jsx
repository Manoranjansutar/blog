import Lottie from 'lottie-react'
import React from 'react'
import nodata from './../assets/no-data.json';

const NoDataMessage = () => {
  return (
    <div className='flex items-center justify-center'>
      <Lottie animationData={nodata} className='w-96'/>
    </div>
  )
}

export default NoDataMessage

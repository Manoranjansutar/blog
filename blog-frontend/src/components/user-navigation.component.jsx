import React, { useContext, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import { LuFileEdit } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import { removeFromSession } from '../common/session'

const UserNavigationPanel = () => {
    const {userAuth:{username},setUserAuth} = useContext(UserContext);

    const signoutUser = ()=>{
        removeFromSession("user");
        setUserAuth({access_token:null});
    }
    
  return (
    <AnimationWrapper transition={{duration:0.2}}
      className="absolute right-0 z-50 mt-5"
    >
        <div className='absolute right-0 duration-200 bg-white border border-grey w-60'>
            
        <Link to="/editor"  className='flex gap-2 py-4 pl-8 md:hidden link'>
            <LuFileEdit />
            Write
        </Link>
        
        <Link to={`/user/${username}`} className='py-4 pl-8 link'>
         Profile
        </Link>

        <Link to='/dashboard/blogs' className='py-4 pl-8 link'>
         Dashboard
        </Link>

        <Link to='/setting/edit-profile' className='py-4 pl-8 link'>
         Setting
        </Link>

        <span className='absolute border-t border-grey w-[100%]'></span>

        <button className='w-full py-4 pl-8 text-left hover:bg-grey' onClick={signoutUser} >
            <h1 className='mb-1 text-xl font-bold'>Sign Out</h1>
            <p className='text-dark-grey'>@{username}</p>
        </button>
        
        </div>
    </AnimationWrapper>
  )
}

export default UserNavigationPanel

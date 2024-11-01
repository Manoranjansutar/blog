import Lottie from 'lottie-react'
import React, { useContext, useState } from 'react'
import logo from './../assets/logo.json';
import search from './../assets/search.json';
import { Link , Outlet } from 'react-router-dom';
import { LuFileEdit } from "react-icons/lu";
import { UserContext } from '../App';
import notification from './../assets/notification.json';
import UserNavigationPanel from './user-navigation.component';



const Navbar = () => {
    const [searchBoxVisibilty,setSearchBoxVisibility] = useState(false);

    const {userAuth, userAuth:{access_token,profile_img}} = useContext(UserContext);

    const [userNavPanel,setUserNavPanel] = useState(false);

    const handleUserNavPanel = () => {
      setUserNavPanel(currentVal => !currentVal)
    }

    const handleBlur = () =>{
      setTimeout(() => {
        setUserNavPanel(false)
      }, 200);
    }
    
  return (
   <>
        <nav className='navbar'>
            <Link to="/" className='flex items-center justify-center'>
             <Lottie animationData={logo} className='w-14' />
             <p className='text-xl leading-loose text-black space-mono-bold md:text-2xl'>BlogSpace</p>
            </Link>
    
            <div className={'absolute left-0 w-full py-4 bg-white border-b top-full border-grey px-[5vw] mt-0.5 md:border-0 md:block md:relative md:inset-0 md:p-0 md:show ' + (searchBoxVisibilty ? "show" : "hide")}>
               <input type="text" placeholder='Search' className='w-full p-4 pl-6 rounded-full bg-grey px-[12%] md:px-14 placeholder:text-dark-grey md:w-auto md:pl-16'/> 
               <Lottie animationData={search} className='absolute w-10 right-[10%] top-1/2 -translate-y-1/2 md:left-6 md:pointer-events-none' />
            </div>
    
            <div className='flex items-center gap-3 ml-auto md:gap-6'>
               <button className='w-10 h-10 rounded-full bg-grey md:hidden'>
                 <Lottie animationData={search} className='w-10'  onClick={()=>setSearchBoxVisibility(!searchBoxVisibilty)}/>
               </button>  
    
               <Link to='/editor' className='hidden gap-2 md:flex link'>
                <p className='flex items-center justify-center gap-2 font-bold space-mono-regular'>
                 <LuFileEdit />
                 Write
                </p>
               </Link>

               {
                 access_token ? 
                 <>
                   <Link to='/dashboard/notification'>
                    <button className='relative flex items-center justify-center w-12 h-12 rounded-full bg-grey hover:bg-black/10'>
                     <Lottie animationData={notification} className='w-7'/>
                    </button>
                   </Link>

                   <div className='relative ' onClick={handleUserNavPanel} onBlur={handleBlur}>
                     <button className='w-10 h-10'>
                       <img src={profile_img} alt="" className='object-cover w-full h-full rounded-full'/>
                      </button> 
                      {
                        userNavPanel ?  <UserNavigationPanel /> : ""
                      }

                   </div>
                 </>
                 : <>
                     <Link className='flex items-center justify-center py-2 btn-dark space-mono-regular' to='/signin'>
                      Sign In
                    </Link>
    
                    <Link className='hidden py-2 font-bolder btn-light md:block space-mono-regular' to='/signup'>
                     Sign Up
                   </Link>
                  </>
               }
    
            </div>
        </nav>
    
        <Outlet />
   </>
  )
}

export default Navbar

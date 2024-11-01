import React, { useEffect, useRef, useState } from 'react'

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({routes, defaultActiveIndex=0,defaultHidden = [],children}) => {
    let [inPageNavIndex,setInPageNavIndex] = useState(defaultActiveIndex);
     activeTabLineRef = useRef();
     activeTabRef = useRef()

    const changePageState = (btn,i) =>{
        let {offsetWidth,offsetLeft} = btn;
        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(i)
    }

    useEffect(()=>{
      changePageState(activeTabRef.current,defaultActiveIndex)
    },[])
    
  return (
    <>
     <div className='relative flex mb-8 overflow-x-auto bg-white border-b border-grey flex-nowrap'>
       {
         routes.map((route,i)=>{
            return (
                <button key={i} className={'p-4 px-5 ' + (inPageNavIndex === i ? "text-black " :"text-dark-grey ") + ( defaultHidden.includes(route) ? "md:hidden" : "")}
                onClick={(e)=>{changePageState(e.target,i)}}
                ref={i===defaultActiveIndex ? activeTabRef : null}
                >{route}</button>
            )
         })
       }
       <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300'/>
       
     </div> 
     
     {Array.isArray(children)? children[inPageNavIndex]:children}
    </>
  )
}

export default InPageNavigation

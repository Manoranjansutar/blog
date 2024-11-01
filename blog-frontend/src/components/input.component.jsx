import Lottie from 'lottie-react'
import React from 'react'
import { FaEye } from "react-icons/fa";

const InputBox = ({name,type,value,id,placeholder,icon,width,autocomplete}) => {
  return (
    <div className='relative w-[100%] mb-4'>
      <input 
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        icon={icon}
        autoComplete={autocomplete}
        className='ml-6 input-box'
      />

      <Lottie animationData={icon} className={' '+width+' input-icon ml-5'}/>
      
      {
         type === 'password' ?
         <FaEye className='left-[auto]  input-icon cursor-pointer right-4 text-xl'/> : ""
      }
      
    </div>
  )
}

export default InputBox

import React, { createContext, useContext, useRef } from 'react'
import InputBox from '../components/input.component'
import user from './../assets/user.json';
import email from './../assets/email.json';
import password from './../assets/password.json';
import google from './../assets/google.png';
import { Link, Navigate } from 'react-router-dom';
import AnimationWrapper from '../common/page-animation';
import {Toaster,toast} from 'react-hot-toast';
// import 'dotenv/config';
import axios from 'axios'
import { storeInSession } from '../common/session';
import { UserContext } from '../App';



const UserAuthForm = ({type}) => {
   const VITE_SERVER_DOMAIN = "http://localhost:3000";

   let {userAuth:{access_token}, setUserAuth} = useContext(UserContext);
   console.log(access_token)

   const userAuthThroughServer = (serverRoute,formData)=>{
      axios.post(VITE_SERVER_DOMAIN + serverRoute,formData)
      .then(({data})=>{
         storeInSession("user",JSON.stringify(data))
         setUserAuth(data);
      })
      .catch(({response})=>{
         toast.error(response.data.error)
      })
   }
   
   const handleSubmit = (e)=>{
      e.preventDefault();
      let serverRoute = type === "sign-in" ? "/signin" : "/signup"
      let form = new FormData(formElement);
      let formData = {};
      for(let [key,value] of form.entries()){
         formData[key] = value;
      }

      let {fullname,email,password} = formData;

      
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
      let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password
      
      if(fullname){
         if (!fullname && fullname.length < 3) {
            return toast.error("Fullname must be greater than 3")
        }
      }
      
     if (!email.length) {
        return toast.error("Please enter email" )
     }
 
     if (!emailRegex.test(email)) {
        return toast.error("Invalid email")
     }
 
     if (!passwordRegex.test(password)) {
        return toast.error("Password should be 6 to 20 characters long with a numeric , 1 lowercase and 1 uppercase letters")
     }

     userAuthThroughServer(serverRoute,formData)
   }
  return (
   access_token ? 
      <Navigate to="/" />
   :
   <AnimationWrapper keyvalue={type}>
      <section className='flex items-center justify-center h-cover'>
         <Toaster/>
      <form className='w-[80%] max-w-[400px]'  id='formElement'>
         <h1 className='mb-24 text-4xl text-center capitalize font-gelasio'>
            {type==='sign-in' ? "Welcome back" : "Join us today"}
         </h1>
         {
            type !== 'sign-in' ? 
            <InputBox 
             name="fullname"
             type="text"
             placeholder="Full Name"
             icon={user}
             width="w-6"
             autocomplete="fullname"
            /> : ""
         }
            <InputBox 
             name="email"
             type="email"
             placeholder="Email"
             icon={email}
             width="w-8"
             autocomplete="email"
            />
            
            <InputBox 
             name="password"
             type="password"
             placeholder="Password"
             icon={password}
             width="w-7"
             autocomplete="password"
            /> 
         <button className='mt-14 btn-dark center space-mono-regular' type='submit' onClick={handleSubmit}>
            {type.replace("-"," ")}
         </button>

         <div className='relative flex items-center w-full gap-2 my-10 font-bold text-black uppercase opacity-20'>
             <hr className='w-1/2 border-black'/>
             <p>or</p>
             <hr className='w-1/2 border-black'/>
         </div>

         <button className='flex items-center justify-center gap-4 btn-dark center w-[90%] space-mono-regular'>
            <img src={google} alt="" className='w-5'/>
            continue with google
         </button>

         {
            type === 'sign-in' ?
            <p className='mt-6 text-xl text-center text-dark-grey '>
              Dont have an account ? 
              <Link to='/signup' className='ml-2 text-xl text-black underline'>
                Join us today
              </Link> 
            </p> : 
            <p className='mt-6 text-xl text-center text-dark-grey '>
            Already a memeber ? 
            <Link to='/signin' className='ml-2 text-xl text-black underline'>
              Sign in here
            </Link> 
          </p>
         }
      </form>
    </section>
   </AnimationWrapper>
    
  )
}

export default UserAuthForm

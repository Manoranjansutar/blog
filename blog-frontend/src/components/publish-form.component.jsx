import React, { useContext } from 'react'
import AnimationWrapper from '../common/page-animation'
import { Toaster,toast  } from 'react-hot-toast'
import Lottie from 'lottie-react'
import cross from './../assets/cross.json';
import { EditorContext } from '../pages/editor.pages';
import Tags from './tags.component';
import arrow from './../assets/arrow-2.json';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';


const PublishForm = () => {
  const characterLimit = 200;
  const tagLimit = 10;
  const VITE_SERVER_DOMAIN = "http://localhost:3000";
  const navigate = useNavigate();
  
  
  let { blog:{banner,title,des,tags,content},setEditorState,blog , setBlog } = useContext(EditorContext)

  

  let {userAuth: {access_token}} = useContext(UserContext)

  
  const handleCloseEvent = () => {
     setEditorState("editor")
  }

  const handleBlogTitleChange = (e) =>{
    let input = e.target;
    setBlog({...blog, title:input.value})
  }

  const handleBlogDesChange = (e)=>{
    let input = e.target;
    setBlog({...blog,des:input.value})
  }

  const handleDesKeyDown = (e) => {
    if(e.keyCode === 13){
      e.preventDefault();
    }
  }

  const handleKeyDown = (e) =>{
     if(e.keyCode === 13 || e.keyCode === 188){
        e.preventDefault();
        let tag = e.target.value
        if(tags.length < tagLimit){
          if(!tags.includes(tag) && tag.length){
             setBlog({...blog, tags:[...tags,tag]})
          }
        } else {
           toast.error("You can add max 10 tags")
        }
        e.target.value = "";
     }
  }

  const publishBlog = (e)=>{

    if(e.target.className.includes('disable')){
      return;
    }
    
    if(!title.length){
      return toast.error("Write blog title before publishing")
    }

    if(!des.length || des.length> characterLimit){
      return toast.error("Write blog description within 200 characters to publish")
    }

    if(!tags.length){
      return toast.error("Write atleast 1 tag before publishing")
    }

    let loadingToast = toast.loading("Publishing....")

    e.target.classList.add('disable');

    let blogObj = {
      title,des,banner,content,tags,draft:false
    }

    axios.post(VITE_SERVER_DOMAIN + "/create-blog",blogObj, {
      headers:{
        Authorization: `Bearer ${access_token}` 
      }
    }).then(()=>{
      e.target.classList.remove('disable')
      toast.dismiss(loadingToast);
      toast.success("Published...")

      setTimeout(() => {
        navigate("/")
      }, 500);
    }).catch(({response})=>{
      e.target.classList.remove('disable')
      toast.dismiss(loadingToast);

      // return toast.error(response.data.error)
      return toast.error("there is an error in publishing blog")
    })


    
  }

  
  return (
    <AnimationWrapper>
      <section className='grid items-center w-screen min-h-screen py-16 lg:grid-cols-2 lg:gap-4'>
        <Toaster/>
        <button className='absolute right-[5vw] w-12 h-12 z-10 top-[5%] lg:top-[10%]' onClick={handleCloseEvent}>
          <Lottie animationData={cross}/>
        </button>

        <div className='max-w-[550px] center'>
         <p className='mb-1 text-dark-grey'>Preview</p>
         <div className='w-full mt-4 overflow-hidden rounded-lg aspect-video bg-grey'>
           <img src={banner} alt="" />
         </div>
         <div>
          <h1 className='mt-2 text-3xl font-medium leading-tight lg:text-4xl line-clamp-2 space-mono-regular'>{title}</h1>
          <p className='mt-4 text-xl leading-7 font-gelasio line-clamp-2 '>{des}</p>
         </div>
        </div>

        <div className='border-grey lg:border-1 lg:pl-8'>
          <p className='mb-2 text-dark-grey mt-9'>Blog Title</p>
          <input type="text" placeholder="Blog Title" defaultValue={title} className='pl-4 input-box ' onChange={handleBlogTitleChange}/>

          {/* <p className='mb-2 text-dark-grey mt-9'>{content}</p> */}

           <p className=' text-dark-grey mt-9'>Short description about your blog</p>
           
          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className='h-40 pl-4 leading-7 resize-none input-box'
            onChange={handleBlogDesChange}
            onKeyDown={handleDesKeyDown}
          >
          </textarea>
          <p className='mt-1 text-sm text-right text-dark-grey '>{characterLimit-des.length} Character left</p>

          <p className=' text-dark-grey mt-9'>Topics</p>
          
          <div className='relative py-2 pb-4 pl-2 input-box'>
             <input type="text" placeholder='Topics' className='sticky top-0 pl-4 mb-3 bg-white input-box focus:bg-white' onKeyDown={handleKeyDown}/>
            {
               tags.map((tag,i)=>{
                 return  <Tags tag={tag} tagIndex={i} key={i}/>
               })
            }
            <p className='mt-1 text-sm text-right text-dark-grey '>{tagLimit-tags.length} Tags left</p>
            
            <button className='flex items-center justify-center gap-3 px-8 btn-dark space-mono-regular' onClick={publishBlog}>
              <Lottie animationData={arrow} className='w-14'/>
              Publish
            </button>
            
          </div>
          
        </div>

      </section>
    </AnimationWrapper>
  )
}

export default PublishForm

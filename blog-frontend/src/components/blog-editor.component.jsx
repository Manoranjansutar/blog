import Lottie from 'lottie-react'
import React, { useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from './../assets/logo.json';
import AnimationWrapper from '../common/page-animation';
import defaultBanner from './../assets/blog banner.png';
import { uploadImage } from '../common/aws';
import { Toaster,toast } from 'react-hot-toast';
import { EditorContext } from '../pages/editor.pages';
import EditorJs from '@editorjs/editorjs'
import tools from './tools.component';
import axios from 'axios';
import { UserContext } from '../App';

const BlogEditor = () => {

  
  useEffect(()=>{
    setTextEditor(new EditorJs({
      holder: "textEditor",
      data:content,
      tools:tools,
      placeholder:"Lets write a awesome blog!!!"
    }))
  },[])

  const {blog,blog: {title,banner,content,tags,des} , setBlog ,setTextEditor,textEditor,setEditorState} = useContext(EditorContext)

  let {userAuth: {access_token}} = useContext(UserContext)

  let navigate = useNavigate()

  const VITE_SERVER_DOMAIN = "http://localhost:3000";

    const handleBannerChange = (e) =>{
        let img = e.target.files[0];
        
        if(img){
          let loadingToast = toast.loading("Uploading...")
           uploadImage(img)
           .then((url) => {
            if (url) {
              toast.dismiss(loadingToast)
              toast.success("Uploaded!!!")

              setBlog({...blog,banner:url})
            }
          })
          .catch(err=>{
            toast.dismiss(loadingToast);
            return toast.error(err);
          })
        }
    }
    
    const handleTitleKeyDown = (e) => {
      if(e.keyCode === 13){
        e.preventDefault();
      }
    }
    const handleTitleChange = (e) => {
      let input = e.target;
      input.style.height = 'auto';
      input.style.height = input.scrollHeight + "px";

      setBlog({...blog, title:input.value})
    }

    const handleError = (e)=>{
      let img = e.target;
      img.src = defaultBanner;
    }

    const handlePublishEvent = () =>{
       if(!banner.length){
          return toast.error("Upload a blog banner to publish it")
       }
       if(!title.length){
          return toast.error("Write blog title to publish it")
       }
       if(textEditor.isReady){
          textEditor.save().then(data =>{
             if(data.blocks.length){
                setBlog({...blog,content:data})
                setEditorState("publish")
             } else {
              return toast.error("Write something in blog to publish it")
             }
          }).catch(error => {
            console.error("Error saving editor content:", error)
            toast.error("An error occurred while saving the blog content")
          })
       }
    }

    const handleSaveDraft = (e) =>{
      if(e.target.className.includes('disable')){
        return;
      }
      
      if(!title.length){
        return toast.error("Write blog title before saving it in draft")
      }
      
      let loadingToast = toast.loading("Saving draft....")
  
      e.target.classList.add('disable');

      if(textEditor.isReady){
        textEditor.save().then(content =>{
          let blogObj = {
            title,des,banner,content,tags,draft:true
          }
      
          axios.post(VITE_SERVER_DOMAIN + "/create-blog",blogObj, {
            headers:{
              Authorization: `Bearer ${access_token}` 
            }
          }).then(()=>{
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast);
            toast.success("Saved...")
      
            setTimeout(() => {
              navigate("/")
            }, 500);
          }).catch(({response})=>{
            e.target.classList.remove('disable')
            toast.dismiss(loadingToast);
      
            // return toast.error(response.data.error)
            return toast.error("there is an error in saving draft")
          })
        })
      }
    }



    
  return (
    <>
     <nav className='navbar'>
       <Link to='/' className='flex-none w-10'>
         <Lottie animationData={logo}/>
       </Link>
       <p className='w-full text-black max-md:hidden line-clamp-1'>
        {
           title.length ? title : " New Blog"
        }
        </p>
       <div className='flex gap-4 ml-auto'>
        <button className='py-2 btn-dark' onClick={handlePublishEvent}>Publish</button>
        <button className='py-2 btn-light' onClick={handleSaveDraft}>Save Draft</button>
       </div>
     </nav> 
     <Toaster/>
     <AnimationWrapper>
       <section>
       <div className='w-full mx-auto max-w-[900px]'>
           <div className='relative bg-white border-4 aspect-video border-grey hover:opacity-80'>
             <label htmlFor='uploadBanner'>
                <img src={banner}  alt="" className='z-20'onError={handleError}/>
                <input 
                id='uploadBanner'
                type="file" 
                accept='.png,.jpg,.jpeg'
                hidden
                onChange={handleBannerChange}
                />
             </label>
           </div> 

           <textarea
             defaultValue={title}
             placeholder='Blog-Title'
             className='w-full h-20 mt-10 text-3xl font-medium leading-tight outline-none resize-none placeholder:opacity-40 md:text-4xl lg:text-4xl '
             onKeyDown={handleTitleKeyDown}
             onChange={handleTitleChange}
           ></textarea>

          <hr className='w-full my-5 opacity-10'/>

          <div className='font-gelasio' id='textEditor'></div>
           
        </div>
       </section>
     </AnimationWrapper>
    </>
  )
}

export default BlogEditor

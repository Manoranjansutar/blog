import React, { useEffect, useState } from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation, { activeTabRef } from '../components/inpage-navigation.component'
import axios from 'axios';
import Loader from './../components/loader.component';
import BlogPostCard from '../components/blog-post.component';
import MinimalBlogPost from '../components/nobanner-blog-post.component';
import Lottie from 'lottie-react';
import trending from './../assets/trending.json';
import NoDataMessage from '../components/nodata.component';



const Homepage = () => {
  const VITE_SERVER_DOMAIN = "http://localhost:3000";
  let [blogs,setBlogs] = useState(null);
  let [trendingBlogs,setTrendingBlogs] = useState(null)
  let categories = ["programming","hollywood","film making","social media","cooking","tech","finances","travel"];
  let [pageState,setPageState] = useState("home")
  
  const fetchLatestBlogs = () =>{
    axios.get(VITE_SERVER_DOMAIN + "/latest-blog")
    .then(({data})=>{
      setBlogs(data.blogs)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  const fetchTrendingBlogs = () =>{
    axios.get(VITE_SERVER_DOMAIN + "/trending-blog")
    .then(({data})=>{
      setTrendingBlogs(data.blogs)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  useEffect(()=>{
    activeTabRef.current.click();
    if(pageState==="home"){
      fetchLatestBlogs()
    } else{
      fetchBlogByCategory()
    }

    if(!trendingBlogs){
      fetchTrendingBlogs()
    }
  },[pageState])

  const fetchBlogByCategory = () =>{
    axios.post(VITE_SERVER_DOMAIN + "/search-blogs" , {tag: pageState})
    .then(({data})=>{
      setBlogs(data.blogs)
    })
    .catch(err=>{
      console.log(err)
    })
  }

  const loadBlogByCategory = (e) =>{
     let category = e.target.innerText.toLowerCase();
     setBlogs(null)
     if(pageState===category){
      setPageState("home");
      return
     }

     setPageState(category);
     
  }
  return (
    <AnimationWrapper>
      <section className='flex justify-center gap-10 h-cover'>
        {/*  latest blog */}
        <div className='w-full'>
            <InPageNavigation routes={[pageState,"Trending Blogs"]} defaultHidden={["Trending Blogs"]}>
              <>
                {
                   blogs === null ?( <Loader/>
                   ): (
                    blogs.length ? 
                      blogs.map((blog,i)=>{
                       return (
                         <AnimationWrapper transition={{duration:1,delay:i*0.2}} key={i}>
                          <BlogPostCard content={blog} author={blog.author.personal_info}/>
                        </AnimationWrapper>
                     )
                   }) : <NoDataMessage />
                  )
                }
              </>
            {/* trending blogs in small devices */}
            <>
                {
                   trendingBlogs === null ? <Loader/>
                   : 
                   trendingBlogs.map((blog,i)=>{
                     return (
                        <AnimationWrapper transition={{duration:1,delay:i*0.2}} key={i}>
                          <MinimalBlogPost blog={blog} index={i}/>
                        </AnimationWrapper>
                     )
                   })
                }
              </>
              
            </InPageNavigation>
         </div>
         {/* filters and trending blogs */}
         <div className='min-w-[40%] lg:min-w-[400px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden'>
           <div className='flex flex-col gap-10'>
             <h1 className='text-xl font-medium '>Stories from all interest</h1>
             <div className='flex flex-wrap gap-3 '>
              {
                 categories.map((category,i)=>{
                    return(
                      <button key={i} className={'tag ' + (pageState===category ? "bg-black text-white" : "") } onClick={loadBlogByCategory}>{category}</button>
                    )
                 })
              }
             </div>
           <div>
           <h1 className='flex gap-3 mb-8 text-xl font-medium'>
            Trending  <Lottie animationData={trending} className='w-8'/>
           </h1>
           {
                   trendingBlogs === null ? (<Loader/>
                   ): 
                  ( trendingBlogs.map((blog,i)=>{
                     return (
                        <AnimationWrapper transition={{duration:1,delay:i*0.2}} key={i}>
                          <MinimalBlogPost blog={blog} index={i}/>
                        </AnimationWrapper>
                     )
                   })
                  )
                }
           </div>
         </div>
         </div>
         
      </section>
    </AnimationWrapper>
  )
}

export default Homepage

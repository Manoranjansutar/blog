import React from 'react'
import { getDay } from '../common/date';
import { CiHeart } from "react-icons/ci";
import { Link } from 'react-router-dom';

const BlogPostCard = ({content,author}) => {
    const {publishedAt,title,tags,des,banner,activity:{total_likes},blog_id:id} = content;
    const {fullname,profile_img,username} = author;
  return (
    <Link to={`/blog/${id}`}  className='flex items-center gap-8 pb-5 mb-4 border-b border-grey'>
        <div className='w-full'>
            <div className='flex items-center gap-2 mb-7'>
                <img src={profile_img} alt="" className='w-6 h-6 rounded-full' />
                <p className='line-clamp-2'>{fullname} @{username}</p>
                <p className='min-w-fit'>{getDay(publishedAt)}</p>
            </div>
            <h1 className='blog-title work-sans'>{title}</h1>
            <p className='my-3 text-xl leading-7 font-gelasio max-sm:hidden md:max-[1100px]:hidden line-clamp-2 work-sans'>{des}</p>
            <div className='flex gap-4 mt-7'>
               <span className='px-4 py-1 btn-light' >{tags[0]}</span>
               <span className='flex items-center gap-2 ml-3 text-dark-grey'>
               <CiHeart className='w-10'/> {total_likes}
               </span>
                
            </div>
        </div>
        <div className='h-28 aspect-square bg-grey '>
           <img src={banner} alt="" className='object-cover w-full h-full aspect-square '/> 
        </div>
    </Link>
  )
}

export default BlogPostCard

import React from 'react'
import { Link } from 'react-router-dom';
import { getDay } from '../common/date';

const MinimalBlogPost = ({blog,index}) => {
    let {title,blog_id:id,author:{personal_info:{fullname,username,profile_img}},publishedAt} = blog;
  return (
    <Link to={`/blog/${id}`} className='flex gap-5 mb-8 group'>
      
      <h1 className='blog-index group-hover:text-dark-grey'>{index<10 ? "0" + (index+1) : index}</h1>

      <div>
        <div className='flex gap-2 mb-2'>
            <img src={profile_img} alt="" className='w-6 h-6 rounded-full'/>
            <p className='truncate'>{fullname} @{username}</p>
            <p className='min-w-fit'>getDay(publishedAt)</p>
        </div>

        <h1 className='blog-title space-mono-regular group-hover:underline'>{title}</h1>
      </div>
      
    </Link>
  )
}

export default MinimalBlogPost
getDay
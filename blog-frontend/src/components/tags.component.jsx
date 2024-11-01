import React, { useContext } from 'react'
import { RxCross2 } from "react-icons/rx";
import { EditorContext } from '../pages/editor.pages';



const Tags = ({tag , tagIndex}) => {
    let {blog,blog:{tags}, setBlog} = useContext(EditorContext)

    const addTagEditable = (e) => {
        e.target.setAttribute("contentEditable" , true);
        e.target.focus();
    }

    const handleTagDelete = (tagToDelete) => {
        const updatedTags = blog.tags.filter(t => t !== tagToDelete);
        setBlog({...blog, tags: updatedTags})
    }

    const handleTagEdit = (e) =>{
        if(e.keyCode === 13 || e.keyCode === 188) {
            e.preventDefault();
            let currentTag = e.target.innerText
            tags[tagIndex] = currentTag;
            setBlog({...blog,tags})
            console.log(tags)
            e.target.setAttribute("contentEditable" , false)
        }
    }
    
  return (
    <div className='relative inline-block p-2 px-10 mt-2 mr-2 bg-white rounded-full hover:bg-opacity-50'>
      <h1 className='outline-none' onClick={addTagEditable} onKeyDown={handleTagEdit}>{tag}</h1>
      <button className='absolute mt-[2px] rounded-full right-4 top-1/2 -translate-y-1/2' onClick={()=>{handleTagDelete(tag)}}>
      <RxCross2 className='pointer-events-none' />
      </button>
    </div>
  )
}

export default Tags

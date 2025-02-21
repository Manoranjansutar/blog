import Embd from '@editorjs/embed'
import List from '@editorjs/list'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import InlineCode from '@editorjs/inline-code'
import { uploadImage } from '../common/aws'


const uploadImageByURL = (e) => {
    let link = new Promise((resolve,reject)=>{
        try {
            resolve(e)
        } catch (error) {
            reject(error)
        }
    })

    return link.then(url=>{
        return {
            success:1,
            file: {url}
        }
    })
}

const uploadImageByFile = (e) =>{
   return  uploadImage(e).then(url=>{
        if(url){
            return {
                success:1,
                file:{url}
            }
        }
     })
}

const tools = {
    embd : Embd,
    list : {
        class:List,
        inlineToolbar:true
    },
    header : {
        class: Header,
        config : {
            placeholder: "Type Heading",
            levels:[2,3],
            defaultLevel:2
        }
    },
    image : {
        class: Image,
        config: {
            uploader: {
                uploadByUrl : uploadImageByURL,
                uploadByFile : uploadImageByFile
            }
           
        }
    },
    quote : {
        class: Quote,
        inlineToolbar:true
    },
    marker : Marker,
    inlineCode : InlineCode
}

export default tools;

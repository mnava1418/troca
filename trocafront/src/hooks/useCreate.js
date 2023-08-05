import { useState } from 'react'

function useCreate(currTitle, currDescription, currPrice, currImg) {
    const [title, setTitle] = useState(currTitle)
    const [description, setDescription] = useState(currDescription)
    const [price, setPrice] = useState(currPrice)    
    const [imgFile, setImgFile] = useState(currImg)

    return { 
        title, setTitle, 
        description, setDescription, 
        price, setPrice,        
        imgFile, setImgFile
    }
}

export default useCreate

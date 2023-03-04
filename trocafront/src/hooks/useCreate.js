import { useState } from 'react'

function useCreate(currTitle, currDescription, currPrice, currRoyalties, currImg) {
    const [title, setTitle] = useState(currTitle)
    const [description, setDescription] = useState(currDescription)
    const [price, setPrice] = useState(currPrice)
    const [royalties, setRoyalties] = useState(currRoyalties)
    const [imgFile, setImgFile] = useState(currImg)

    return { 
        title, setTitle, 
        description, setDescription, 
        price, setPrice,
        royalties, setRoyalties,
        imgFile, setImgFile
    }
}

export default useCreate

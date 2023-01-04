import axios from 'axios'

const getInstance = (baseURL, headers, token) => {
    const instance = axios.create({
        baseURL, 
        headers: {...headers, 'Authorization': token ? token : ''}
    })
    return instance    
}

export const get = async (baseURL, path, token = undefined, headers = {'Content-Type': 'application/json'}) => {
    const instance = getInstance(baseURL, headers, token)
    const result = await instance.get(path).catch(error => {
        return processError(error)
    })

    return result
}

export const post = async (baseURL, path, data, token = undefined, headers = {'Content-Type': 'application/json'}) => {
    const instance = getInstance(baseURL, headers, token)
    const result = await instance.post(path, data ).catch(error => {
        return processError(error)
    })

    return result
}

const processError = (error) => {
    console.error(error);
    
    if (error.response) {
        return {status: error.response.status, data: error.response.data}
    } else {
        return {status: 500, data:{error: 'Unexpected error. Try again later.'}}
    }
}
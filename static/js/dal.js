function getDialogs() {
    const promise = axios.get('http://127.0.0.1:5000/api/dialogs')
    return promise.then(data => {
        return data
    })
};

function getUser(id) {
    const promise = axios.get(`http://127.0.0.1:5000/api/users?user_id=${id}`)
    return promise.then(data => {
        return data
    })
}

function getMessages(id = 0, count = 1) {
    const promise = axios.get(`http://127.0.0.1:5000/api/messages?user_id=${id}&count=${count}`)
    return promise.then(data => {
        return data
    })
}

function sendMessage(content, id = 0) {
    const promise = axios.post(`http://127.0.0.1:5000/api/messages?user_id=${id}&content=${content}`)
    return promise.then(data => {
        return data
    })
}

function getPosts(id = 0) {
    const promise = axios.get(`http://127.0.0.1:5000/api/posts?user_id=${id}`)
    return promise.then(data => {
        return data
    })
}

function sendPost(content) {
    const promise = axios.post(`http://127.0.0.1:5000/api/posts?content=${content}`)
    return promise.then(data => { 
        return data 
    })
}
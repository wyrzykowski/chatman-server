const generateMessage = (username,text)=>{
    return{
        text,
        createdAt: new Date().getTime(),
        username
    }
};

const generateLocationMessage = (username,url)=>{

    return{
        username,
        url,
        createdAt: new Date().getTime()
    }
};

module.exports = {
    generateMessage,
    generateLocationMessage
};
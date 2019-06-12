const users=[];

//addUser
const addUser = ({id,username,room})=>{
    //Clean the data / removing extra spaces etc.
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();


    //validate the data
    if(!username || !room){
        return{
            error: 'Username and room are required!'
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username;
    });
    //Validate username (check if user with that name already exist)
    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }
    //store user
    const user = {id,username,room};
    users.push(user);
    return {user}
};




//removeUser
const removeUser= (id)=>{
    const index = users.findIndex((user)=>{
        return user.id ===id
    });

    if(index !==-1){
        return users.splice(index,1)[0]//1 becouse I remove one item, [0] becouse I want to return object
    }
}


//getUser
const getUser = (id)=>{
    let user;
user =users.find((user)=>{
        return user.id ===id;
    })
    if(!user){
        user = {username:"undefined",room:"undefined"};
    }
    return user;
}

//getUsersInRoom
const getUsersInRoom = (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>{
        return user.room === room;
    })
}






module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
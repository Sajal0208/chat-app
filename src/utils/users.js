const users = []

const addUser = ({ id , username , room }) => {
    // Clean The Data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the Data
    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate Username
    if(existingUser){
        return {
            error: 'User is in use!'
        }
    }

    // Store User
    const user = { id , username , room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    }) 
    if(index !== -1){
        return users.splice(index , 1)[0]
    }
}

const getUser = (id) => {
    if(!id){
        return {
            error: 'Please provide valid details'
        }
    }
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room);
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
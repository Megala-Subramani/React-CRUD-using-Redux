var InitialState = {
    users:[],
    error: ""
}

export default function UserDetailsReducer(state=InitialState,action){
    var newObject = {...state}; 

    if(action.type === "GetUserDetails"){
        newObject.users = action.data;
        return newObject;
    }else if(action.type === "ErrorOnGetUserDetails"){
        newObject.error = action.data;
        return newObject;
    }else if(action.type === "DeleteUserDetails"){
        let delId = action.data;
        let users = newObject.users.filter(function(user){
            return user.id !== delId
        })
        newObject.users = users;
        return newObject;
    }else if(action.type === "UpdateUserDetails"){
        let dataObj = action.data;
        let userData ={users : [...newObject.users]}
        userData.users.forEach((user,index) => {
            if(user.id === dataObj.id){
                userData.users[index] = dataObj;
            }
        })
        newObject.users = userData.users;
        return newObject;
    }else if(action.type === "CreateUserDetails"){
        let userData ={users : [...newObject.users]}
        userData.users[userData.users.length] = action.data;
        newObject.users = userData.users;
        return newObject;
    }
    return newObject;
}
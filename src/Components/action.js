export function GetUserDetailsAPI(){
    return ((dispatch)=>{
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response) => response.json())
            .then((json)=>{
                
                dispatch(GetUserDetails(json));
            })
            .catch((error)=>{dispatch(ErrorOnGetUserDetails(error))})
    })
}

export function GetUserDetails(users){
    
    return{
        type : "GetUserDetails",
        data : users
    }
}

export function ErrorOnGetUserDetails(error){
    return{
        type : "ErrorOnGetUserDetails",
        data : error
    }
}

export function DeleteUserDetailsAPI(id){
    var url="https://jsonplaceholder.typicode.com/users/"+id;
    return ((dispatch)=>{
        fetch(url, {
            method: 'DELETE',
        })
        .then((response) => response.json())
        .then((json)=>{
             //this is fake API So you wont get any response for delete option
            dispatch(DeleteUserDetails(id));
        })
        .catch((error)=>{dispatch(ErrorOnDeleteUserDetails(error))})
    })
}

export function DeleteUserDetails(id){
    return {
        type : "DeleteUserDetails",
        data : id
    }
}

export function ErrorOnDeleteUserDetails(error){
    return {
        type : "ErrorOnDeleteUserDetails",
        data  :error
    }
}

export function UpdateUserDetailsAPI(obj){
    var url="https://jsonplaceholder.typicode.com/users/"+obj.id;
    return ((dispatch)=>{
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify(obj.data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => 
        {
            console.log("Changes Updated!!!",json);
            dispatch(UpdateUserDetails(json));
        })
        .catch((error)=>{dispatch(ErrorOnUpdateUserDetails(error))})
    });
}

export function UpdateUserDetails(obj){
    return {
        type : "UpdateUserDetails",
        data : obj
    }
}

export function ErrorOnUpdateUserDetails(reason){
    return {
        type : "ErrorOnUpdateUserDetails",
        data : reason
    }
}

export function CreateUserDetailsAPI(obj){
    var url="https://jsonplaceholder.typicode.com/users";
    return ((dispatch)=>{
        fetch(url,{
            method:"POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((json) => 
        {
            json.id = obj.id; // Response of this POST always giving default id:11 , 
            //its because resource will not be really updated on the server but it will be faked as if. 
            dispatch(CreateUserDetails(json));
        })
        .catch((error)=>{dispatch(ErrorOnCreateUserDetails(error))})
    });
}

export function CreateUserDetails(obj){
    return {
        type : "CreateUserDetails",
        data : obj
    }
}

export function ErrorOnCreateUserDetails(reason){
    return {
        type : "ErrorOnCreateUserDetails",
        data : reason
    }
}
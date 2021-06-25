import React,{useContext,useEffect, useState} from 'react';
import './Common.css'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import {GetUserDetailsAPI,DeleteUserDetailsAPI,UpdateUserDetailsAPI,CreateUserDetailsAPI} from './Components/action';
import {UserContext} from './Context'
import {useSelector,useDispatch} from 'react-redux';


function UserDetailsFuncComponent (){  
    debugger;
    const userData = useSelector(state=> state.users);
    const errorData = useSelector(state=> state.error);
    const dispatch = useDispatch();
    var stateObj = useContext(UserContext);
    const [newItem,setNewItem] = useState({
        name:"",
        address:{city:""},
        phone:""
    });
    const [dummyrender,setDummyrender] = useState(false);

    useEffect(function(){
        debugger;
        console.log("UseEffect(componentDidMount) from UserDetailsFuncComponent");
        stateObj.APIcall = true;
        dispatch(GetUserDetailsAPI());
    },[])

    function updateUserRecords(event){
        debugger;
        console.log("Am Entered!!!");
       var myUsers = stateObj.userState;
       var index=event.target.attributes["data-index"].nodeValue;
       var parentObj=event.target.attributes["data-parentobj"];
       var user = myUsers[index];
       var name=event.target.name;
       if(parentObj !== undefined){
            parentObj = parentObj.nodeValue;
            user[parentObj][name] = event.target.value;
       }else{
            user[name] = event.target.value;
       }        
       setDummyrender(!dummyrender);
       console.log("While onTextChange====>:",stateObj);
    }
    function changesUpdatedCheck(event){
        var tbody=event.target.parentElement.parentElement.parentElement;
        var saveBtnLen = tbody.getElementsByClassName("saveButtonAlive").length;
        if(saveBtnLen > 0){
            alert("Please Save/Cancel the highlighted record")
            return false;
        }
        return true;
    }
    function editCurrentRecord(event){
        if(changesUpdatedCheck(event)){   
            var curItem = event.target;
            curItem.setAttribute("class","hideButton");
            curItem.nextElementSibling.setAttribute("class","hideButton");
            curItem.nextElementSibling.nextElementSibling.removeAttribute("class");
            curItem.nextElementSibling.nextElementSibling.nextElementSibling.removeAttribute("class");
            curItem.nextElementSibling.nextElementSibling.setAttribute("class","saveButtonAlive");
            changeInputEdit(curItem,false);
        }
    }
    function deleteCurrentRecord(event){
        if(changesUpdatedCheck(event)){   
            var name=event.target.parentElement.parentElement.getAttribute("name");
            var id=event.target.attributes["data-id"].nodeValue;
            if(window.confirm("Are you sure to delete '"+name+"' Record?")){
                stateObj.APIcall = true;
                dispatch(DeleteUserDetailsAPI(parseInt(id,10)));
            }
        }
    }
    function updateStateValues(users){
        if (users === null || typeof users !== 'object') {
            return users;
        }
        var storage = users.constructor(); 
        for (var key in users) {
           storage[key] = updateStateValues(users[key]);
        }
        return storage;
    }
    function changeInputEdit(curItem,setAttr){
        var inputEle = curItem.parentElement.parentElement.getElementsByClassName("nonEditable");
        var len=inputEle.length;
        for(var i=0;i<len;i++){
            if(setAttr){
                inputEle[i].setAttribute("readonly",true);
                inputEle[i].removeAttribute("style");
            }else{
                inputEle[i].removeAttribute("readonly");
                inputEle[i].setAttribute("style","border:2px solid black !important")
            }           
        }
    }
    function cancelCurrentUpdate(event){
        var curItem = event.target;
        curItem.setAttribute("class","hideButton");
        curItem.previousElementSibling.setAttribute("class","hideButton");
        curItem.previousElementSibling.previousElementSibling.removeAttribute("class");
        curItem.previousElementSibling.previousElementSibling.previousElementSibling.removeAttribute("class");
        stateObj.APIcall = true;
        changeInputEdit(curItem,true);
        setDummyrender(true);
    }
    function saveCurrentRecord(event){
        var curItem = event.target;
        curItem.setAttribute("class","hideButton");
        curItem.nextElementSibling.setAttribute("class","hideButton");
        curItem.previousElementSibling.removeAttribute("class");
        curItem.previousElementSibling.previousElementSibling.removeAttribute("class");
        var id=curItem.attributes["data-id"].nodeValue;
        var index=curItem.attributes["data-index"].nodeValue;
        stateObj.APIcall = true;
        var users = stateObj.userState;
        var user = users[index];
        var newObj = {id:parseInt(id,10),data : user};
        dispatch(UpdateUserDetailsAPI(newObj));
        changeInputEdit(curItem,true);        
    }
    function onChangeNewItem(event){
        var itemObj = newItem;
        itemObj = updateStateValues(itemObj);
        if(event.target.name === "city"){
            itemObj["address"][event.target.name] = event.target.value;
        }else{
            itemObj[event.target.name] = event.target.value;
        }      
        setNewItem(itemObj);
    }
    function createNewItem(event){
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.nextElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.nextElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.nextElementSibling.nextElementSibling.removeAttribute("class");
    }
    function saveNewItem(event){
        if(newItem.name === "" || newItem.address.city === "" || newItem.phone === ""){
            alert("Please fill all input box");
            return false;
        }
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.setAttribute("class","hideBtn");

        curTarget.nextElementSibling.nextElementSibling.setAttribute("class","hideBtn");
        var dv=curTarget.nextElementSibling.nextElementSibling.childNodes[0];
        clearAllInpBox(dv);
        var itemObj = newItem;
        var newObject = updateStateValues(itemObj);
        var idLen=userData.length;
        newObject["id"] = parseInt(userData[idLen-1].id,10)+1;        
        stateObj.APIcall = true;
        dispatch(CreateUserDetailsAPI(newObject));
    }
    function clearAllInpBox(dv){
        var htmlColl = dv.children;
        var len = dv.childElementCount;
        for(var i=0;i<len;i++){
            htmlColl[i].value="";
        }
    }
    function cancelNewItem(event){
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.previousElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.setAttribute("class","hideBtn");
        var dv=curTarget.nextElementSibling.childNodes[0];
        clearAllInpBox(dv);
        var newObj = {
            name:"",
            address:{city:""},
            phone:""
        };
        setNewItem(newObj);
    }       
        
    if(stateObj.APIcall){
        stateObj.userState = updateStateValues(userData);
        stateObj.APIcall = false;           
    }
    return (<React.Fragment>
        <div className="pageHeader">CRUD Using Redux</div><br></br>
        <div className="BtnDV" >  
            <ReactHTMLTableToExcel  
                    className="btnClass"  
                    table="user"  
                    filename="ReportExcel"  
                    sheet="Sheet"  
                    buttonText="Export excel" />  
        </div>  
        <div id="addNewItem" >
            <input id="btn_newItem" type="button" value="NewItem" onClick={createNewItem} />
            <input id="btn_saveItem" type="button" className="hideBtn" value="Save" onClick={saveNewItem} />
            <input id="btn_cancelItem" type="button" className="hideBtn" value="Cancel" onClick={cancelNewItem} />
            <div id="newItemInputSet" className="hideBtn"  >
                <div id="innerDiv" >
                <input type="text" placeholder="Enter Name" name="name" maxLength="25" onChange={onChangeNewItem} />
                <input type="text" placeholder="Enter Address" name="city" maxLength="50" onChange={onChangeNewItem} />
                <input type="text" placeholder="Enter Phone Number" name="phone" maxLength="30" onChange={onChangeNewItem} />
                </div>
            </div>
        </div><br></br>
    <div style={{marginLeft:'23%'}}>

        <table id="user" border="1">
            <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>City</th>
                <th>Phone Number</th>
                <th>Edit / Delete Record</th>
            </tr>
            </thead>
            <tbody>
            {    
                stateObj.userState.map((user,index)=>{ return (  
                <tr name={user.name} key={index} >
                    <td className="identityNumber" ><input type="text" readOnly={true} style={{border:'0px'}} name="id" value={user.id} /></td>
                    <td><input type="text" className="nonEditable" data-index={index} readOnly={true} value={user.name} name="name" onChange={updateUserRecords} /></td>
                    <td><input type="text" className="nonEditable" data-index={index} readOnly={true} data-parentobj="address" value={user.address.city} name="city" onChange={updateUserRecords}  /></td>
                    <td><input type="text" className="nonEditable" data-index={index} readOnly={true} value={user.phone} name="phone" onChange={updateUserRecords} /></td>
                    <td><input type="button" value="Edit" onClick={editCurrentRecord} />
                    <input type="button" value="Delete" data-id={user.id} data-index={index} onClick={deleteCurrentRecord} />
                    <input type="button" className="hideButton" value="Save" data-id={user.id} data-index={index} onClick={saveCurrentRecord} />
                    <input type="button" className="hideButton" value="Cancel" data-id={user.id} data-index={index} onClick={cancelCurrentUpdate} /></td>
                </tr>)
                })
            }
            </tbody>
        </table>
    </div></React.Fragment>);
}
export default UserDetailsFuncComponent;
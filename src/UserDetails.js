import React from 'react';
import './Common.css'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import {GetUserDetailsAPI,DeleteUserDetailsAPI,UpdateUserDetailsAPI,CreateUserDetailsAPI} from './Components/action';
import  {connect} from 'react-redux';
import {UserContext} from './Context'


export class UserDetails extends React.Component{ 
    static contextType = UserContext;
    constructor(props){
        super(props);
        this.state={
            users:[],
            orgUsers:[],
            newItem:{
                name:"",
                address:{city:""},
                phone:""
            },
            dummyrender:false
        }
    }
    componentDidMount=()=>{
        console.log("componentDidMount from UserDetails");
        let stateObj = this.context;
        stateObj.APIcall = true;
        this.props.userDetailsAPI();
    }
    updateUserRecords=(event)=>{
        console.log("Am Entered!!!");
       let stateObj = this.context;
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
       this.setState({dummyrender:true});
       console.log("While onTextChange====>:",stateObj);
    }
    changesUpdatedCheck(event){
        var tbody=event.target.parentElement.parentElement.parentElement;
        var saveBtnLen = tbody.getElementsByClassName("saveButtonAlive").length;
        if(saveBtnLen > 0){
            alert("Please Save/Cancel the highlighted record")
            return false;
        }
        return true;
    }
    editCurrentRecord=(event)=>{
        if(this.changesUpdatedCheck(event)){   
            var curItem = event.target;
            curItem.setAttribute("class","hideButton");
            curItem.nextElementSibling.setAttribute("class","hideButton");
            curItem.nextElementSibling.nextElementSibling.removeAttribute("class");
            curItem.nextElementSibling.nextElementSibling.nextElementSibling.removeAttribute("class");
            curItem.nextElementSibling.nextElementSibling.setAttribute("class","saveButtonAlive");
            this.changeInputEdit(curItem,false);
        }
    }
    deleteCurrentRecord=(event)=>{
        if(this.changesUpdatedCheck(event)){   
            var name=event.target.parentElement.parentElement.getAttribute("name");
            var id=event.target.attributes["data-id"].nodeValue;
            if(window.confirm("Are you sure to delete '"+name+"' Record?")){
                let stateObj = this.context;
                stateObj.APIcall = true;
                this.props.deleteUserAPI(parseInt(id,10));
            }
        }
    }
    updateStateValues(users){
        if (users === null || typeof users !== 'object') {
            return users;
        }
        var storage = users.constructor(); 
        for (var key in users) {
           storage[key] = this.updateStateValues(users[key]);
        }
        return storage;
    }
    changeInputEdit(curItem,setAttr){
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
    cancelCurrentUpdate=(event)=>{
        var curItem = event.target;
        curItem.setAttribute("class","hideButton");
        curItem.previousElementSibling.setAttribute("class","hideButton");
        curItem.previousElementSibling.previousElementSibling.removeAttribute("class");
        curItem.previousElementSibling.previousElementSibling.previousElementSibling.removeAttribute("class");
        let stateObj = this.context;
        stateObj.APIcall = true;
        this.changeInputEdit(curItem,true);
        this.setState({dummyrender:true});
    }
    saveCurrentRecord=(event)=>{
        var curItem = event.target;
        curItem.setAttribute("class","hideButton");
        curItem.nextElementSibling.setAttribute("class","hideButton");
        curItem.previousElementSibling.removeAttribute("class");
        curItem.previousElementSibling.previousElementSibling.removeAttribute("class");
        var id=curItem.attributes["data-id"].nodeValue;
        var index=curItem.attributes["data-index"].nodeValue;
        let stateObj = this.context;
        stateObj.APIcall = true;
        var users = stateObj.userState;
        var user = users[index];
        var newObj = {id:parseInt(id,10),data : user};
        this.props.updateUserAPI(newObj);
        this.changeInputEdit(curItem,true);        
    }
    onChangeNewItem=(event)=>{
        var itemObj = this.state.newItem;
        itemObj = this.updateStateValues(itemObj);
        if(event.target.name === "city"){
            itemObj["address"][event.target.name] = event.target.value;
        }else{
            itemObj[event.target.name] = event.target.value;
        }        
        this.setState({
            newItem : itemObj
        });
    }
    createNewItem=(event)=>{
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.nextElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.nextElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.nextElementSibling.nextElementSibling.removeAttribute("class");
    }
    saveNewItem=(event)=>{
        if(this.state.newItem.name === "" || this.state.newItem.address.city === "" || this.state.newItem.phone === ""){
            alert("Please fill all input box");
            return false;
        }
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.setAttribute("class","hideBtn");

        curTarget.nextElementSibling.nextElementSibling.setAttribute("class","hideBtn");
        var dv=curTarget.nextElementSibling.nextElementSibling.childNodes[0];
        this.clearAllInpBox(dv);
        var itemObj = this.state.newItem;
        var newObject = this.updateStateValues(itemObj);
        var idLen=this.props.userData.length;
        newObject["id"] = parseInt(this.props.userData[idLen-1].id,10)+1;        
        let stateObj = this.context;
        stateObj.APIcall = true;
        this.props.createUserAPI(newObject);
    }
    clearAllInpBox(dv){
        var htmlColl = dv.children;
        var len = dv.childElementCount;
        for(var i=0;i<len;i++){
            htmlColl[i].value="";
        }
    }
    cancelNewItem=(event)=>{
        var curTarget=event.target;
        curTarget.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.setAttribute("class","hideBtn");
        curTarget.previousElementSibling.previousElementSibling.removeAttribute("class");
        curTarget.nextElementSibling.setAttribute("class","hideBtn");
        var dv=curTarget.nextElementSibling.childNodes[0];
        this.clearAllInpBox(dv);
        var newArray = {
            name:"",
            address:{city:""},
            phone:""
        };
        this.setState({newArr:newArray});
    }
    render(){        
        var stateObj = this.context;
        if(stateObj.APIcall){
            stateObj.userState = this.updateStateValues(this.props.userData);
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
                <input id="btn_newItem" type="button" value="NewItem" onClick={this.createNewItem} />
                <input id="btn_saveItem" type="button" className="hideBtn" value="Save" onClick={this.saveNewItem} />
                <input id="btn_cancelItem" type="button" className="hideBtn" value="Cancel" onClick={this.cancelNewItem} />
                <div id="newItemInputSet" className="hideBtn"  >
                    <div id="innerDiv" >
                    <input type="text" placeholder="Enter Name" name="name" maxLength="25" onChange={this.onChangeNewItem} />
                    <input type="text" placeholder="Enter Address" name="city" maxLength="50" onChange={this.onChangeNewItem} />
                    <input type="text" placeholder="Enter Phone Number" name="phone" maxLength="30" onChange={this.onChangeNewItem} />
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
                        <td><input type="text" className="nonEditable" data-index={index} readOnly={true} value={user.name} name="name" onChange={this.updateUserRecords} /></td>
                        <td><input type="text" className="nonEditable" data-index={index} readOnly={true} data-parentobj="address" value={user.address.city} name="city" onChange={this.updateUserRecords}  /></td>
                        <td><input type="text" className="nonEditable" data-index={index} readOnly={true} value={user.phone} name="phone" onChange={this.updateUserRecords} /></td>
                        <td><input type="button" value="Edit" onClick={this.editCurrentRecord} />
                        <input type="button" value="Delete" data-id={user.id} data-index={index} onClick={this.deleteCurrentRecord} />
                        <input type="button" className="hideButton" value="Save" data-id={user.id} data-index={index} onClick={this.saveCurrentRecord} />
                        <input type="button" className="hideButton" value="Cancel" data-id={user.id} data-index={index} onClick={this.cancelCurrentUpdate} /></td>
                    </tr>)
                    })
                }
                </tbody>
            </table>
        </div></React.Fragment>);
    }
}
function mapPropsToState(state){
    return {
        userData : state.users,
        errorData : state.error
    }
}
function mapDispatchToProps(dispatch){
    return {        
        userDetailsAPI : ()=>{dispatch(GetUserDetailsAPI())},
        deleteUserAPI : (id)=>{dispatch(DeleteUserDetailsAPI(id))},
        updateUserAPI : (obj)=>{dispatch(UpdateUserDetailsAPI(obj))},
        createUserAPI : (obj)=>{dispatch(CreateUserDetailsAPI(obj))}
    }
}
export default UserDetails = connect(mapPropsToState,mapDispatchToProps)(UserDetails);
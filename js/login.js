const ID_USER = 25801;
const USERS_INFO = "usersList";
let newUser = {};
let usersList = [];

//Función que guarda el email utilizado por el usuario bajo la key "userName" y guarda el UserId bajo el Key "userId" , en el Local Storage
function setUserInfo(name, id) {
    localStorage.setItem("userName", name);
    localStorage.setItem("userId", id);
}

function redirectPagPrincipal() {
    window.location.href = "pagprincipal.html";
}

//Funcion que obtiene del LocalStorage la lista con la informacion de los usuarios que ya se han logueado
function getUsersList(){
    return JSON.parse(localStorage.getItem(USERS_INFO));
}

//Funcion que guarda la lista de usuarios modificada
function setUsersList(newList){
    localStorage.setItem(USERS_INFO, JSON.stringify(newList))
}

//Funcion que crea objeto usuario y actualiza la lista de usuario del localStorage
function addNewUser(email){
    
    newUser.firstName = "";
    newUser.secondName = "";
    newUser.firstLastName = "";
    newUser.secondLastName = "";
    newUser.userEmail = email;
    newUser.phone = "";
    usersList.push(newUser);
    setUsersList(usersList);

}

//Función que chequea si el usuario ya existe en la lista
function alreadyOnList(email){

    if(usersList.length > 0 ){
        for(let i=0; i<usersList.length; i++){
            if(usersList[i].userEmail === email){
              return true;
            }
        }    
    }
  
    return false;
  }

document.addEventListener("DOMContentLoaded", function (e) {
    
    if(localStorage.getItem(USERS_INFO)){
        usersList = getUsersList();
    }

    document.getElementById("iniciarSesion").addEventListener("click", function () {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let algoVacio = false;
        if (email == "") {
            algoVacio = true;
            alert("El email no puede ser vacío");
        }
        if (password == "") {
            algoVacio = true;
            alert("La contraseña no puede ser vacía");
        }
        if (!algoVacio) {
            setUserInfo(email, ID_USER);
            if(!alreadyOnList(email)){
                addNewUser(email);
            }
            redirectPagPrincipal();
        }
    });
});

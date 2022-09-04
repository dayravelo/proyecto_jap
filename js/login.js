//Función que guarda el email utilizado por el usuario en el Local Storage, bajo la key "userName"
function setUserName(name) {
    localStorage.setItem("userName", name);
}

function redirectPagPrincipal() {
    window.location.href = "pagprincipal.html";
}

document.getElementById("iniciarSesion").addEventListener("click", function(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let algoVacio = false;
    if(email == "") {
        algoVacio = true;
        alert("El email no puede ser vacío");
    } 
    if (password == "") {
        algoVacio = true;
        alert("La contraseña no puede ser vacía");
    } 
    if (!algoVacio) {
        setUserName(email);
        redirectPagPrincipal();
    }
});


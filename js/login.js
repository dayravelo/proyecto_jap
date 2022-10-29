const ID_USER = 25801;

//Función que guarda el email utilizado por el usuario bajo la key "userName" y guarda el UserId bajo el Key "userId" , en el Local Storage
function setUserInfo(name, id) {
    localStorage.setItem("userName", name);
    localStorage.setItem("userId", id);
}

function redirectPagPrincipal() {
    window.location.href = "pagprincipal.html";
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
        redirectPagPrincipal();
    }
});


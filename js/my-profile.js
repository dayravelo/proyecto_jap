const USERS_INFO = "usersList";
let usersInformation = [];
let newUser = {};

//Funcion que obtiene del LocalStorage la lista con la informacion de los usuarios que ya se han logueado
function getUsersInfo() {
    return JSON.parse(localStorage.getItem(USERS_INFO));
}

//Función de alerta por no estar logueado y redireccionamiento
function alertNoLogin() {
    alert("Debe estar logueado para acceder al perfil");
    window.location.href = "index.html";
}

//Función que genera HTML para mostrarle los campos que puede modificar el usuario
function userInfo() {
    let html = `
                <div class="text-center p-4">
                <h2>Perfil</h2>
                </div>
                <div class="border-top border-bottom">
                    <br>
                    <div class="row g-3">
                        <div class="col">
                            <label for="firstName" class="form-label">Primer nombre*</label>
                            <div class="form-group input-group has-validation">
                                <input id="firstName" type="text" class="form-control to-validate" required>
                                <div class="invalid-feedback">Debe ingresar primer nombre</div>
                            </div>
                        </div>
                        <div class="col">
                            <label for="secondName" class="form-label">Segundo nombre</label>
                            <div class="form-group input-group">
                                <input id="secondName" type="text" class="form-control">
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row g-3">
                        <div class="col">
                            <label for="firstLastName" class="form-label">Primer Apellido*</label>
                            <div class="form-group input-group has-validation">
                                <input id="firstLastName" type="text" class="form-control to-validate" required>
                                <div class="invalid-feedback">Debe ingresar su primer apellido</div>
                            </div>
                        </div>
                        <div class="col">
                            <label for="secondLastName" class="form-label">Segundo Apellido</label>
                            <div class="form-group input-group">
                                <input id="secondLastName" type="text" class="form-control">
                            </div>
                        </div>
                    </div>
                    <div class="row g-3">
                    <div class="col">
                        <label for="userEmail" class="form-label">E-mail*</label>
                        <div class="form-group input-group has-validation">
                            <input id="userEmail" type="text" class="form-control to-validate" required>
                            <div class="invalid-feedback">Debe ingresar un email</div>
                        </div>
                    </div>
                    <div class="col">
                        <label for="phone" class="form-label">Teléfono de contacto*</label>
                        <div class="form-group input-group has-validation">
                            <input id="phone" type="text" class="form-control to-validate" required>
                            <div class="invalid-feedback">Debe ingresar un teléfono</div>
                        </div>
                    </div>
                    </div>
                    <br>
                </div>
                <br>
                <input id="saveChanges" class="btn btn-primary" type="button" value="Guardar cambios">
    `
    document.getElementById("userProfile").innerHTML = html;
}


//Función que carga la información del usuario si este ya existe en el localStorage
function loadUserInfo(userName, usersInformation) {
    for (let i = 0; i < usersInformation.length; i++) {
        let user = usersInformation[i];
        if (user.userEmail === userName) {
            setInfo(user);
        }
    }
}

//Función que carga la info del LocalStorage para mostrarle al usuario
function setInfo(user) {
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("secondName").value = user.secondName;
    document.getElementById("firstLastName").value = user.firstLastName;
    document.getElementById("secondLastName").value = user.secondLastName;
    document.getElementById("userEmail").value = user.userEmail;
    document.getElementById("phone").value = user.phone;
}

//Función que actualiza el localStorage
function updateUserInfo(position, email) {

    if (position >= 0) {
        if (document.getElementById("userEmail").value === email) {
            usersInformation[position].firstName = document.getElementById("firstName").value;
            usersInformation[position].secondName = document.getElementById("secondName").value;
            usersInformation[position].firstLastName = document.getElementById("firstLastName").value;
            usersInformation[position].secondLastName = document.getElementById("secondLastName").value;
            usersInformation[position].userEmail = document.getElementById("userEmail").value;
            usersInformation[position].phone = document.getElementById("phone").value;
        } else { //por si cambió el email
            newUser.firstName = document.getElementById("firstName").value;
            newUser.secondName = document.getElementById("secondName").value;
            newUser.firstLastName = document.getElementById("firstLastName").value;
            newUser.secondLastName = document.getElementById("secondLastName").value;
            newUser.userEmail = document.getElementById("userEmail").value;
            newUser.phone = document.getElementById("phone").value;
            localStorage.setItem("userName", document.getElementById("userEmail").value);
            usersInformation.push(newUser);
        }

        localStorage.setItem(USERS_INFO, JSON.stringify(usersInformation));
        alert("¡Cambios guardados correctamente!");

    } else {
        alert("No se pudo guardar la información del usuario");
    }

}

//Función que chequea si el usuario ya existe en la lista y devuelve su posición
function positionOnList(email) {

    let defaultReturn = -1;
    if (usersInformation.length > 0) {
        for (let i = 0; i < usersInformation.length; i++) {
            if (usersInformation[i].userEmail === email) {
                return i;
            }
        }
    }

    return defaultReturn;
}

//Función que chequea que los campos requeridos no sean nulos
function checkNotNulls() {

    let firstName = document.getElementById("firstName").value;
    let firstLastName = document.getElementById("firstLastName").value;
    let userEmail = document.getElementById("userEmail").value;
    let phone = document.getElementById("phone").value;

    if (firstName === "" || firstLastName === "" || userEmail === "" || phone === "") {
        return false;
    }

    return true;
}

//Evento de carga de página 
document.addEventListener("DOMContentLoaded", function (e) {
    if (localStorage.getItem(USER_NAME)) {
        userInfo();
        if (localStorage.getItem(USERS_INFO) && JSON.parse(localStorage.getItem(USERS_INFO)).length > 0) {

            usersInformation = JSON.parse(localStorage.getItem(USERS_INFO));
            loadUserInfo(getUserName(), usersInformation);
        } else {
            document.getElementById("userEmail").value = getUserName();
        }
    } else {
        alertNoLogin();
    }

    //Evento click para el botón Guardar Cambios, chequea que los campos no sean nulos y agrega la información al localstorage, de lo contrario muestra una alerta al usuario
    document.getElementById("saveChanges").addEventListener("click", function () {
        if (checkNotNulls()) {
            updateUserInfo(positionOnList(getUserName()), getUserName());
        } else {
            alert("Existen campos obligatoros vacíos");
        }
    });

});

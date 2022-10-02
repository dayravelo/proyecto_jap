const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

//Función que obtiene del Local Storage una key "userName"
function getUserName(){
  return userName = localStorage.getItem("userName");
}

//Función que obtiene del Local Storage llama a la función getUserName la muestra en el elemento HTML con id "userName"
function addUserName(){
  let userName = getUserName();
  document.getElementById("userName").innerHTML = userName;
}

//Función que guarda en el Local Storage el productId, y redirige al usuario a la página product-info.html
function setProductID(productId) {
  localStorage.setItem("productId", productId);
  window.location = "product-info.html"
}

/*Función que se ejecuta cuando el usuario hace click en cerrar cesión, despliega un pop-up de confirmación y si el usuario confirma,
borra del Local Storage el userName guardado y redirige al usuario a la página de inicio de sesión */
function logout(){
  if(confirm("Desea cerrar sesión?")){
    window.location.href = "index.html";
    localStorage.removeItem("userName");
  }
}

//Función que despliega la barra de menu superior que aparece en todos las paginas
function navBarMenu(){
  let html = `
              <ul class="navbar-nav w-100 justify-content-between">
                <li class="nav-item">
                  <a class="nav-link active" href="pagprincipal.html">Inicio</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="categories.html">Categorías</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="sell.html">Vender</a>
                </li>
                <li class="nav-item">
                  <div class="dropdown">
                    <a class="dropdown-toggle" role="button" href="#" data-bs-toggle="dropdown" aria-expanded="false" id="userName"></a>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
                      <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
                      <li onclick="logout()"><a class="dropdown-item" href="#">Cerrar sesión</a></li>
                    </ul>
                  </div>
                </li>
              </ul>
            `;

  document.getElementById("navbarNav").innerHTML = html;
}

//Cada vez que se carga la página, se llama a la función addUserName para que aparezca el nombre del usuario que está logueado 
document.addEventListener("DOMContentLoaded", function(e){
  navBarMenu();
  addUserName();
});
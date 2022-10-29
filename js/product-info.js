const MAX_STARS = 5;
const DEFAULT_COUNT = 1;
let productId = "";
let currentProductInfo;
let currentProductImages = [];
let currentProductComments = [];
let relatedProducts = [];
let shoppingCart = [];
let item = {};

//Función que obtiene el elemento "productId" guardado anteriormente en el Local Storage
function getProductID() {
    return localStorage.getItem("productId");
}

//Función que recibe una lista y la ordena según la puntuación, de mayor a menor
function orderCommentsScore(currentProductComments) {
    let auxComments = [];
    auxComments = currentProductComments.sort(function (a, b) {

        let aScore = parseInt(a.score);
        let bScore = parseInt(b.score);

        if (aScore > bScore) { return -1; }
        if (aScore < bScore) { return 1; }
        return 0;
    });

    return auxComments;

}

//Función que recibe una lista que contiene imagenes, la recorre y va agregando al html una a una
function showProductImages(currentProductImages) {

    let htmlContentToAppend = "";

    for (let i = 0; i < currentProductImages.length; i++) {
        let image = currentProductImages[i];

        htmlContentToAppend += `
                        <div class="col">
                            <img src="${image}" class="bd-placeholder-img card-img-top">
                        </div>
                    
                            `
    }

    document.getElementById("productImages").innerHTML = htmlContentToAppend;
}

function showProductImagesCarrousel(currentProductImages) {

    let htmlCarouselIndicators = `<div class="carousel-indicators" id="indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                                `;

    let htmlCarrouselInner = `<div class="carousel-inner" id="inner">
                                <div class="carousel-item active">
                                    <img src="${currentProductImages[0]}" class="d-block w-100">
                                </div>`;




    for (let i = 1; i < currentProductImages.length; i++) {
        let image = currentProductImages[i];

        htmlCarouselIndicators += `
                                 <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" aria-label="Slide ${i + 1}"></button>
                                 `

        htmlCarrouselInner += `
                                <div class="carousel-item">
                                    <img src="${image}" class="d-block w-100">
                                </div>
                              `;

    }
    htmlCarouselIndicators += `</div>`;
    htmlCarrouselInner += `</div>
                            `;
    let htmlButtons = ` <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>`;

    document.getElementById("carouselExampleIndicators").innerHTML += htmlCarouselIndicators;
    document.getElementById("carouselExampleIndicators").innerHTML += htmlCarrouselInner;
    document.getElementById("carouselExampleIndicators").innerHTML += htmlButtons;


}

//Función que muestra la información de un producto
function showProductInfo() {

    productToItem(currentProductInfo);
    let htmlContentToAppend = "";
    htmlContentToAppend += `
                    
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <strong> <h4 class="mb-1">${currentProductInfo.name}</h4> </strong>
                                <button id="buy" onclick="addProductToTheCart()" class="float-end btn btn-success d-md-flex" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Comprar
                                </button>
                            </div>
                            <hr>
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">¡Se añadió el producto a su carrito!</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        ¿Desea continuar comprando o dirigirse a su carrito de compras?
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continuar comprando</button>
                                        <button type="button" class="btn btn-primary" onclick="goToCarrito()">Mi carrito</button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <a class="float-end" href="products.html">Volver al listado <</a>
                            <strong> <p class="mb-1">Precio: </p> </strong>
                            <p class="mb-1">${currentProductInfo.currency} ${currentProductInfo.cost}</p>
                            <strong> <p class="mb-1">Descripción:</p> </strong>
                            <p class="mb-1">${currentProductInfo.description}</p>
                            <strong> <p class="mb-1">Categoría:</p> </strong>
                            <p class="mb-1">${currentProductInfo.category}</p>
                            <strong> <p class="mb-1">Cantidad de Vendidos:</p> </strong>
                            <p class="mb-1">${currentProductInfo.soldCount} vendidos</p>
                            <strong> <p class="mb-1">Imágenes ilustrativas:</p> </strong>
                        </div>
                `

    document.getElementById("infoProduct").innerHTML = htmlContentToAppend;

}

function goToCarrito() {
    window.location = "cart.html"
}

//Función que recibe una lista de comentarios de un producto y muestra los comentarios de un producto determinado
function showProductComments(currentProductComments) {

    let htmlContentToAppend = "";

    htmlContentToAppend = `<strong> <p class="mb-1">Comentarios: </p> </strong>`;
    if (currentProductComments.length > 0) {

        for (let i = 0; i < currentProductComments.length; i++) {
            let comment = currentProductComments[i];

            htmlContentToAppend += `
                        
                            <div class="col">
                                <p class="mb-1"><strong>${comment.user}</strong> ${comment.dateTime} ${showStars(comment.score)}</p>
                                <p class="mb-1">${comment.description}</p>
                            </div>
                    `
        }

        document.getElementById("comments").innerHTML = htmlContentToAppend;
    } else {
        htmlContentToAppend += `
                                <p class="mb-1">Aún no hay comentarios!</p>
                                `
    }

    document.getElementById("comments").innerHTML = htmlContentToAppend;

}

//Función que recibe una puntuación (del 1 al 5) y genera los html para mostrar esa puntuación en estrellas
function showStars(score) {

    let checkedQuantity = new Array(score);
    let notCheckedQuantity = new Array();
    let htmlStars = "";

    if (score < MAX_STARS) {
        notCheckedQuantity = new Array(MAX_STARS - score);
    }

    for (let i = 0; i < checkedQuantity.length; i++) {
        htmlStars += ` <span class="fa fa-star checked"></span> `;
    }

    if (notCheckedQuantity.length > 0) {
        for (let i = 0; i < notCheckedQuantity.length; i++) {
            htmlStars += ` <span class="fa fa-star"></span>`;
        }
    }

    return htmlStars;
}

//Función que recibe una puntuación, una descripción y un usuario, y muestra en pantalla el comentario agregado
function addComment(score, desc, user) {
    let today = new Date();
    let currentDateTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    let htmlComments = document.getElementById("comments").innerHTML;
    htmlComments += `                   
                    <div class="col">
                        <p class="mb-1"><strong>${user}</strong> ${currentDateTime} ${showStars(score)}</p>
                        <p class="mb-1">${desc}</p>
                    </div>
                    `;
    document.getElementById("comments").innerHTML = htmlComments;
}

//Función que recibe un elemento html del tipo select para resetearlo y además resetea el text area del comentario
function clear(selectElement) {
    document.getElementById("textComment").value = "",
        selectElement.selectedIndex = 0;
}

//Función que muestra al usuario los productos relacionados al producto que está mirando
function showRelatedProducts(relatedProducts) {

    htmlRelatedProducts = "";
    if (relatedProducts.length > 0) {
        for (let i = 0; i < relatedProducts.length; i++) {
            let relatedProduct = relatedProducts[i];
            htmlRelatedProducts += `
                                    <div class="card text-center" onclick="setProductID(${relatedProduct.id})">
                                        <img src="${relatedProduct.image}" alt="${relatedProduct.name}" class="card-img-top">
                                        <div class="card-body">
                                            <h5 class="card-tittle">${relatedProduct.name}</h5>
                                        </div>
                                    </div>
                                `;
        }
    } else {
        htmlRelatedProducts = `<p>No existen productos relacionados.</p>`;
    }

    document.getElementById("relatedProducts").innerHTML = htmlRelatedProducts;

}

//Funcion que convierte un producto actual en un item para el carrito
function productToItem(product) {
    item.count = DEFAULT_COUNT;
    item.currency = product.currency;
    item.id = product.id;
    item.image = product.images[0];
    item.name = product.name;
    item.unitCost = product.cost;
}

//Funcion que agrega el producto actual al carrito
function addProductToTheCart() {
    if (localStorage.getItem("cart")) {
        shoppingCart = getCart();
        if (findById(item.id)) {
            saveCart(JSON.stringify(shoppingCart));
        } else {
            shoppingCart.push(item);
            saveCart(JSON.stringify(shoppingCart));
        }
    } else {
        shoppingCart.push(item);
        saveCart(JSON.stringify(shoppingCart));
    }
}

//Funcion que chequea si un id ya se encuentra en el carrito, y en caso de ser asi suma uno al count de ese item
function findById(id) {
    let finded = false;
    for (let i = 0; i < shoppingCart.length; i++) {
        if (shoppingCart[i].id === id) {
            shoppingCart[i].count += 1; 
            finded = true;
        }
    }
    return finded;
}

//Escucha de evento de carga de página
document.addEventListener("DOMContentLoaded", function (e) {
    productId = getProductID();
    let productInfoUrl = PRODUCT_INFO_URL + productId + EXT_TYPE;

    /*Se solicita a la url de info de producto, la información correspondiente a un determinado producto, se guarda esa información en una lista
    se guarda la lista de imagenes en otra lista, luego se ejecuta la función showProductInfo y por ultimo showProductImages*/
    getJSONData(productInfoUrl).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductInfo = resultObj.data;
            currentProductImages = resultObj.data.images;
            relatedProducts = resultObj.data.relatedProducts;
            showProductInfo(currentProductInfo);
            //showProductImages(currentProductImages);
            showProductImagesCarrousel(currentProductImages);
            showRelatedProducts(relatedProducts);
        }
    });

    let productCommentsUrl = PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE;

    /*Se solicita a la url de comentarios de producto, los comentarios correspondientes a un determinado producto, se guarda esos comentarios en una lista
    luego se ordena esa lista de comentarios por puntuación con la función orderCommentsScore y por último se ejecuta la función showProductComments */
    getJSONData(productCommentsUrl).then(function (resultObj) {
        if (resultObj.status === "ok") {
            currentProductComments = resultObj.data;
            showProductComments(orderCommentsScore(currentProductComments));
        }
    });

    /*Evento click del botón sendComment que agrega un comentario nuevo y reseta los campos, 
    si y solo si el usuario seleccionó una puntuación e ingreso un comentario*/
    document.getElementById("sendComment").addEventListener("click", function () {
        let selectElement = document.getElementById("score");
        let score = parseInt(selectElement.value);
        let textComment = document.getElementById("textComment").value;
        let user = getUserName();
        if (textComment != "" && score != 0) {
            addComment(score, textComment, user);
            clear(selectElement);
        } else {
            alert("Debe ingresar una puntuación y un comentario!");
        }
    });

});
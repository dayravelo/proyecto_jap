const MAX_STARS = 5;
let productId = "";
let currentProductInfo;
let currentProductImages = [];
let currentProductComments = [];

//Función que obtiene el elemento "productId" guardado anteriormente en el Local Storage
function getProductID() {
    return localStorage.getItem("productId");
}

//Función que recibe una lista y la ordena según la puntuación, de mayor a menor
function orderCommentsScore(currentProductComments){
    let auxComments = [];
    auxComments = currentProductComments.sort(function(a, b) {

        let aScore = parseInt(a.score);
        let bScore = parseInt(b.score);

        if ( aScore > bScore ){ return -1; }
        if ( aScore < bScore ){ return 1; }
        return 0;
    });

    return auxComments;

}

//Función que recibe una lista que contiene imagenes, la recorre y va agregando al html una a una
function showProductImages(currentProductImages){

    let htmlContentToAppend = "";

    for(let i = 0; i < currentProductImages.length; i++){
        let image = currentProductImages[i];
        
        htmlContentToAppend += `
                        <div class="col">
                            <img src="${image}" class="bd-placeholder-img card-img-top">
                        </div>
                    
                            `
    }

    document.getElementById("productImages").innerHTML = htmlContentToAppend;
}

//Función que muestra la información de un producto
function showProductInfo(){

    let htmlContentToAppend = "";

    htmlContentToAppend += `
                    
                        <div class="col">
                            <div class="d-flex w-100 justify-content-between">
                                <strong> <h4 class="mb-1">${currentProductInfo.name}</h4> </strong>
                            </div>
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

//Función que recibe una lista de comentarios de un producto y muestra los comentarios de un producto determinado
function showProductComments(currentProductComments){

    let htmlContentToAppend = "";
    
    htmlContentToAppend = `<strong> <p class="mb-1">Comentarios: </p> </strong>`;
    if(currentProductComments.length > 0) {

        for(let i = 0; i < currentProductComments.length; i++){
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
function showStars(score){
    
    let checkedQuantity = new Array(score);
    let notCheckedQuantity = new Array();
    let htmlStars = "";

    if(score<MAX_STARS){
        notCheckedQuantity = new Array(MAX_STARS-score);
    }

    for(let i = 0; i < checkedQuantity.length; i++){
        htmlStars += ` <span class="fa fa-star checked"></span> `;
    }

    if(notCheckedQuantity.length > 0){
        for(let i = 0; i < notCheckedQuantity.length; i++){
            htmlStars += ` <span class="fa fa-star"></span>`;
        }
    }

    return htmlStars;
}

//Función que recibe una puntuación, una descripción y un usuario, y muestra en pantalla el comentario agregado
function addComment(score, desc, user){
    let today = new Date();
    let currentDateTime = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
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
function clear(selectElement){
    document.getElementById("textComment").value = "",
    selectElement.selectedIndex = 0;
}

//Escucha de evento de carga de página
document.addEventListener("DOMContentLoaded", function(e){
    productId = getProductID();
    let productInfoUrl = PRODUCT_INFO_URL + productId + EXT_TYPE;

    /*Se solicita a la url de info de producto, la información correspondiente a un determinado producto, se guarda esa información en una lista
    se guarda la lista de imagenes en otra lista, luego se ejecuta la función showProductInfo y por ultimo showProductImages*/
    getJSONData(productInfoUrl).then (function(resultObj){
        if(resultObj.status === "ok"){
            currentProductInfo = resultObj.data;
            currentProductImages = resultObj.data.images;
            showProductInfo(currentProductInfo);
            showProductImages(currentProductImages);
        }
    });

    let productCommentsUrl = PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE;

    /*Se solicita a la url de comentarios de producto, los comentarios correspondientes a un determinado producto, se guarda esos comentarios en una lista
    luego se ordena esa lista de comentarios por puntuación con la función orderCommentsScore y por último se ejecuta la función showProductComments */
    getJSONData(productCommentsUrl).then (function(resultObj){
        if(resultObj.status === "ok"){
            currentProductComments = resultObj.data;
            showProductComments(orderCommentsScore(currentProductComments));
        }
    });
    
    /*Evento click del botón sendComment que agrega un comentario nuevo y reseta los campos, 
    si y solo si el usuario seleccionó una puntuación e ingreso un comentario*/
    document.getElementById("sendComment").addEventListener("click", function(){
        let selectElement = document.getElementById("score");
        let score = parseInt(selectElement.value);
        let textComment = document.getElementById("textComment").value;
        let user = getUserName();
        if(textComment != "" && score != 0){
            addComment(score, textComment, user);
            clear(selectElement);
        } else {
            alert("Debe ingresar una puntuación y un comentario!");
        }
    });
});
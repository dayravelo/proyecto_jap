let currentProductArray = [];

function productTittle(tittle){
    let htmlTitulo = `<h2>${tittle}</h2>`
    document.getElementById("tituloProducto").innerHTML = htmlTitulo;
}

function getCatID() {
    let catID = localStorage.getItem("catID");
    return PRODUCTS_URL + catID + ".json";
}

function showProductList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductArray.length; i++){
        let product = currentProductArray[i];

        htmlContentToAppend += `
            <div onclick="setCatID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name}</h4>
                            <small class="text-muted">${product.cost} ${product.currency}</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                        <p class="mb-1">${product.soldCount} vendidos</p>
                    </div>
                </div>
            </div>
            `
    }

    document.getElementById("listaProductos").innerHTML = htmlContentToAppend;
    
}

document.addEventListener("DOMContentLoaded", function(e){
    let url = getCatID();
    getJSONData(url).then (function(resultObj){
        if(resultObj.status === "ok"){
            currentProductArray = resultObj.data.products;
            productTittle(resultObj.data.catName);
            showProductList();
        }
    });

});


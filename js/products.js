const ORDER_ASC_BY_COST= "ASC_COST";
const ORDER_DESC_BY_COST = "DESC_COST";
const ORDER_BY_SOLD_COUNT = "SOLD_COUNT";
let currentProductArray = [];
let auxProductArray = [];
let minCost = undefined;
let maxCost = undefined;
let currentSortCriteria = undefined;

//Función que obtiene la key "catID" del Local Storage y retorna la URL correspondiente al producto seleccionado de la lista
function getCatID() {
    let catID = localStorage.getItem("catID");
    return PRODUCTS_URL + catID + EXT_TYPE;
}

function productTittle(tittle){
    let htmlTitulo = `<h2>${tittle}</h2>`
    document.getElementById("tituloProducto").innerHTML = htmlTitulo;
}

/*Función que recibe por parametros un minimo, un maximo y una lista, y retorna la lista filtrada segun 
si el costo de cada elemento de la lista se encuentra entre el mínimo y el máximo recibido*/
function filterProductsByCost(min, max, list){
    return list.filter(product => product.cost >= min && product.cost <= max);
}

function showProductList(){

    let htmlContentToAppend = "";

    if(minCost != undefined && maxCost != undefined){
        auxProductArray = filterProductsByCost(minCost, maxCost, currentProductArray);
    } else {
        auxProductArray = currentProductArray;
    }
   
    for(let i = 0; i < auxProductArray.length; i++){
        let product = auxProductArray[i];

            htmlContentToAppend += `
                <div onclick="setProductID(${product.id})" class="list-group-item list-group-item-action cursor-active">
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

/*Función que recibe un criterio y una lista, y ordena la lista según el criterio recibido utilizando la función .sort
ORDER_ASC_BY_COST: ordena por precio de producto ascendente, de menor a mayor precio
ORDER_DESC_BY_COST: ordena por precio de producto descendente, de mayor a menor precio
ORDER_BY_SOLD_COUNT: ordena por cantidad de vendidos descendente, de mayor a menor cantidad de vendidos */
function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {

            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if ( aCost < bCost ){ return -1; }
            if ( aCost > bCost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {

            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if ( aCost > bCost ){ return -1; }
            if ( aCost < bCost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_SOLD_COUNT){
        result = array.sort(function(a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if ( aSoldCount > bSoldCount ){ return -1; }
            if ( aSoldCount < bSoldCount ){ return 1; }
            return 0;
        });
    }

    return result;
}

//Función que llama a la función sortProducts, y luego llama a la función showProductList para mostrarle los productos ordenados al usuario
function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductArray = productsArray;
    }

    currentProductArray = sortProducts(currentSortCriteria, currentProductArray);

    showProductList();
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

    document.getElementById("rangeFilterCost").addEventListener("click", function(){

        minCost = document.getElementById("rangeFilterCostMin").value;
        maxCost = document.getElementById("rangeFilterCostMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

        showProductList();
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCostMin").value = "";
        document.getElementById("rangeFilterCostMax").value = "";
        minCost = undefined;
        maxCost = undefined;
        showProductList();
    });

    document.getElementById("sortAscCost").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDescCost").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortBySoldCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

});
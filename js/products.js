const ORDER_ASC_BY_COST= "MENOR";
const ORDER_DESC_BY_COST = "MAYOR";
const ORDER_BY_SOLD_COUNT = "RELEVANCIA";
let currentProductArray = [];
let auxListArray = [];
let minCost = undefined;
let maxCost = undefined;
let currentSortCriteria = undefined;

function getCatID() {
    let catID = localStorage.getItem("catID");
    return PRODUCTS_URL + catID + ".json";
}

function productTittle(tittle){
    let htmlTitulo = `<h2>${tittle}</h2>`
    document.getElementById("tituloProducto").innerHTML = htmlTitulo;
}

function filterProductsByCost(min, max, list){

    let auxList = [];
    auxList = list.filter(product => product.cost >= min && product.cost <= max);
    return auxList;
}

function showProductList(){

    let htmlContentToAppend = "";

    if(minCost != undefined && maxCost != undefined){
        auxList = filterProductsByCost(minCost, maxCost, currentProductArray);
    } else {
        auxList = currentProductArray;
    }
   
    for(let i = 0; i < auxList.length; i++){
        let product = auxList[i];

            htmlContentToAppend += `
                <div class="list-group-item list-group-item-action cursor-active">
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

    document.getElementById("rangeFilterCount").addEventListener("click", function(){

        minCost = document.getElementById("rangeFilterCountMin").value;
        maxCost = document.getElementById("rangeFilterCountMax").value;

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

    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductList();
    });

});
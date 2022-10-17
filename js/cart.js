const RESULT = "result";
const CART = "cart"
let currentCart = [];
let currentCartProducts = [];

//Función que recibe una lista de items del carrito y la guarda en el Local Storage con la key "cart"
function saveCart(list){
    localStorage.setItem("cart", list);
}

//Función que obtiene del Local Storage la lista que se guarda bajo la key "cart"
function getCart(){
    return JSON.parse(localStorage.getItem(CART));
}

//Función que calcula el costo total, haciendo la multiplicación entre costo y cantidad que recibe por parámetro
function totalCost(cost, count){
    return cost * count;
}

//Función que actualiza el total en el array del Local Storage llamado "cart", recibe un id y una nueva cantidad
//y actualiza el count del elemento correspondiente a ese id
function updateTotal(id, newCount){

    let actual = getCart();

    for(let i=0; i<actual.length; i++){
        let item = actual[i];
        if(item.id === id){
            item.count = newCount;
        }
    }

    currentCartProducts = actual;
    loadCartInfo(currentCartProducts);
    saveCart(JSON.stringify(currentCartProducts));

}

//Función que recibe una lista de productos en el carrito, recorre la misma y va agregando una fila con la info de ese producto 
//a una tabla de html 
function loadCartInfo(list){
    
    let htmlToAppend = "";

    if(list.length>0){
        for(let i=0; i<list.length; i++){
            let line = list[i];
            htmlToAppend += `<tr class="trTable">
                                <th>
                                    <img class="imagesCart" src="${line.image}"></img>
                                </th>
                                <td>${line.name}</td>
                                <td>${line.currency} ${line.unitCost}</td>
                                <td>
                                    <input class="form-control inputsCount" id="${line.id}" placeholder="" required="" type="number" value="${line.count}" min="0" onchange="updateTotal(${line.id}, this.value)">
                                </td>
                                <td>${line.currency}</td>
                                <td id="result${line.id}">${totalCost(line.unitCost, line.count)}</td>
                                <td> 
                                    <button id="delete${line.id}" type="button" class="btn btn-secondary" onClick="deleteItemFromCart(this.id)">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>`;
        }
    }

    document.getElementById("cartTable").innerHTML = htmlToAppend;
}

//Función que borra un elemento de la tabla
function deleteItemFromCart(id){
    if(confirm("Desea borrar este artículo?")){
        alert("Funcionalidad en desarrollo...");
    }
}

document.addEventListener("DOMContentLoaded", function(e){
    let url = CART_INFO_URL + getUserId() + EXT_TYPE;
        if(!localStorage.getItem(CART)){
            getJSONData(url).then (function(resultObj){
                if(resultObj.status === "ok"){
                    currentCart = resultObj.data;
                    currentCartProducts = currentCart.articles;
                    saveCart(JSON.stringify(currentCartProducts));
                    loadCartInfo(currentCartProducts);

                }
            });
        } else {
            currentCartProducts = getCart();  
            loadCartInfo(currentCartProducts);  
        }

});

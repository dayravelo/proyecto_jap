const RESULT = "result";
const PREMIUM = 0.15;
const EXPRESS = 0.07;
const STANDARD = 0.05;
const DEFAULT_CURRENCY = "USD";
const DEFAULT_CONVERSION_UYU_TO_USD = 41;
const TARJETA = "Tarjeta de crédito";
const TRANSFERENCIA = "Transferencia bancaria";
const NO_PM_SELECTED = "No ha seleccionado";
let currentCartProducts = [];
let checkedRadio = PREMIUM;
let paymentMethodSelected = false;
let paymentMethod;

//Función que calcula el costo total, haciendo la multiplicación entre costo y cantidad que recibe por parámetro
function totalCost(cost, count) {
    return cost * count;
}

//Función que actualiza el total en el array del Local Storage llamado "cart", recibe un id y una nueva cantidad
//y actualiza el count del elemento correspondiente a ese id
function updateTotal(id, newCount) {

    let actual = getCart();

    for (let i = 0; i < actual.length; i++) {
        let item = actual[i];
        if (item.id === id) {
            item.count = newCount;
        }
    }

    currentCartProducts = actual;
    loadCartInfo(currentCartProducts);
    saveCart(JSON.stringify(currentCartProducts));
    updateSubtotalCost();
    updateTotalCosts();

}

//Función que actualiza el subtotal de la compra
function updateSubtotalCost() {
    let sum = 0;
    for (let i = 0; i < currentCartProducts.length; i++) {
        let product = currentCartProducts[i];
        if (product.currency === DEFAULT_CURRENCY) {
            sum += product.unitCost * product.count;
        } else {
            sum += Math.round(product.unitCost / DEFAULT_CONVERSION_UYU_TO_USD) * product.count;
        }
    }

    document.getElementById("subtotal").innerHTML = DEFAULT_CURRENCY + " " + sum;
}

//Funcion que actualiza el costo de envio y el costo total
function updateTotalCosts() {
    let actualSubtotal = parseInt(document.getElementById("subtotal").innerText.substring(4));
    let shippingCost = Math.round(actualSubtotal * checkedRadio);
    let total = actualSubtotal + shippingCost;
    document.getElementById("shipCost").innerHTML = DEFAULT_CURRENCY + " " + shippingCost;
    document.getElementById("totalCost").innerHTML = DEFAULT_CURRENCY + " " + total;
}

//Función que recibe una lista de productos en el carrito, recorre la misma y va agregando una fila con la info de ese producto 
//a una tabla de html 
function loadCartInfo(list) {

    let htmlToAppend = "";

    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            let line = list[i];
            htmlToAppend += `<tr class="trTable">
                                <th>
                                    <img class="imagesCart" src="${line.image}"></img>
                                </th>
                                <td>${line.name}</td>
                                <td>${line.currency} ${line.unitCost}</td>
                                <div>
                                    <td>
                                        <input class="form-control inputsCount" id="${line.name}" placeholder="" min="1" required="" type="number" value="${line.count}" min="0" onchange="updateTotal(${line.id}, this.value)">
                                    </td>
                                </div>
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
function deleteItemFromCart(deleteId) {
    let id = deleteId.substring(6);
    if (confirm("Desea borrar este artículo?")) {
        let filterList = [];
        filterList = currentCartProducts.filter(product => product.id != id);
        currentCartProducts = filterList;
        saveCart(JSON.stringify(currentCartProducts));
        allActions();
    }
}

//Funcion que ejecuta todas las funciones para cargar la información del carrito, actualizar los totales y el metodo de pago
function allActions() {
    loadCartInfo(currentCartProducts);
    updateSubtotalCost();
    updateTotalCosts();
    updatePaymentMethod();
}

//Funcion de alerta warning cuando no hay elementos en el carrito
function noItemsAlert() {
    let html = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        No existen artículos en el carrito!
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    document.getElementById("divAlerts").innerHTML = html;
}

//Funcion de alerta warning que muestra que artículos tienen cantidad 0 para informarle al usuario
function ceroAlert(list) {
    let html = `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        Los siguientes artículos tienen cantidad cero, eliminelos o seleccione la cantidad correspondiente:
        ${list}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    document.getElementById("divAlerts").innerHTML = html;
}

//Función de alerta success para cuando la compra se realizó correctamente (no pude visualizarla)
function successAlert() {
    let html = `
    <div class="alert alert-success d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>
        <div>
            ¡Has comprado con éxito!
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    document.getElementById("divAlerts").innerHTML = html;
}

//Función que actualiza la forma de pago y elimina el error
function updatePaymentMethod() {
    if (paymentMethodSelected) {
        document.getElementById("selectedPaymentMethod").innerHTML = paymentMethod;
    } else {
        document.getElementById("selectedPaymentMethod").innerHTML = NO_PM_SELECTED;
    }

    removeDanger();

}

//Función que remueve clases que indican error en campo de forma de pago
function removeDanger() {
    document.getElementById("selectedPaymentMethod").classList.remove("d-inline");
    document.getElementById("selectedPaymentMethod").classList.remove("text-danger");
}

//Funcion que actualiza la forma de pago como "tarjeta" y bloquea el campo de transferencia bancaria
function card() {
    paymentMethodSelected = true;
    paymentMethod = TARJETA;
    let cardInfo = document.getElementsByClassName("cardInfo");
    for (let i = 0; i < cardInfo.length; i++) {
        element = cardInfo[i];
        element.removeAttribute("Disabled");
    }
    document.getElementById("accountNumber").setAttribute("Disabled", "");
    updatePaymentMethod();
}

//Funcion que actualiza la forma de pago como "transferencia" y bloquea los campos de tarjeta de credito
function bankTransfer() {
    paymentMethodSelected = true;
    paymentMethod = TRANSFERENCIA;
    let cardInfo = document.getElementsByClassName("cardInfo");
    for (let i = 0; i < cardInfo.length; i++) {
        element = cardInfo[i];
        element.setAttribute("Disabled", "");
    }
    document.getElementById("accountNumber").removeAttribute("Disabled");
    updatePaymentMethod();
}

//Evento de carga de página 
document.addEventListener("DOMContentLoaded", function (e) {

    //Si existe el elemento "cart" en el LocalStorage, lo carga y ejecuta todas las acciones correspondientes para cargar la info en pantalla
    //de lo contrario, muestra alerta de que no existen artículos en el carrito
    if (localStorage.getItem(CART)) {
        currentCartProducts = getCart();
        allActions();
        if (JSON.parse(localStorage.getItem(CART)).length < 1) {
            noItemsAlert();
        }
    }

    //evento change para el radio opción PREMIUM, setea la variable y actualiza los costos de envio y el total.
    document.getElementById("premiumradio").addEventListener("change", function () {
        checkedRadio = PREMIUM;
        updateTotalCosts();
    });

    //evento change para el radio opción EXPRESS, setea la variable y actualiza los costos de envio y el total.
    document.getElementById("expressradio").addEventListener("change", function () {
        checkedRadio = EXPRESS;
        updateTotalCosts();
    });

    //evento change para el radio opción STANDARD, setea la variable y actualiza los costos de envio y el total.
    document.getElementById("standardradio").addEventListener("change", function () {
        checkedRadio = STANDARD;
        updateTotalCosts();
    });

    //evento change para el radio opción tarjeta, ejecuta la funcion card()
    document.getElementById("tarjeta").addEventListener("change", function () {
        card();
    });

    //evento change para el radio opción tarjeta, ejecuta la funcion bankTrasnfer() 
    document.getElementById("transferencia").addEventListener("change", function () {
        bankTransfer();
    });

    //evento submit para el form donde se realizan las validaciones de los campos y genera las alertas correspondientes
    document.getElementById("form").addEventListener("submit", function (event) {

        let form = document.getElementById("form");
        let arrayQuantity = document.getElementsByClassName("inputsCount");
        let quantityOk = true;
        let elementsCero = "";
        let cardForm = document.getElementById("cardForm"); //no pude validar los campos de este form
        let bankTransfForm = document.getElementById("bankTransfForm"); //no pude validar los campos de este form


        for (let i = 0; i < arrayQuantity.length; i++) {
            quantity = arrayQuantity[i];
            if (parseInt(quantity.value) < 1) {
                quantityOk = false;
                if (i != arrayQuantity.length - 1) {
                    elementsCero += quantity.id + " - ";
                } else {
                    elementsCero += quantity.id;
                }

            }
        }

        if (form.checkValidity() && paymentMethodSelected && quantityOk /*&& cardForm.checkValidity() && bankTransfForm.checkValidity()*/) {

            currentCartProducts = [];
            localStorage.removeItem(CART);
            alert("¡Has comprado con éxito!");
            successAlert(); 

        } else {
            event.preventDefault();
            form.classList.add("was-validated");
            /*
            cardForm.classList.add("was-validated");
            bankTransfForm.classList.add("was-validated");
            */
            document.getElementById("cartTable").classList.add("was-validated");
            if (!paymentMethodSelected) {
                document.getElementById("selectedPaymentMethod").classList.add("d-inline");
                document.getElementById("selectedPaymentMethod").classList.add("text-danger");
            }
            if (!quantityOk) {
                ceroAlert(elementsCero);
            }

        }

    });


});

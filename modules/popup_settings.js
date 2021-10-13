import {Order} from './models/order.js';

let pizza_type = null;

function closePopup() {
    const popup = document.querySelector(".popup");
    popup.style.display = "none";
}

function openPopup(e) {
    const popup = document.querySelector(".popup");
    popup.style.display = "block";
    pizza_type = e.target.value;
}

function cancel(e) {
    closePopup();
    console.log("cancel");
}

function add(e) {  
    const order = new Order(pizza_type);
    order.save();
    closePopup();
}



export function configure() {
    document.getElementById("cancel").addEventListener("click", cancel);
    document.getElementById("add_order").addEventListener("click", add);

    const buttons = document.querySelectorAll(".menu button");
    for (const button of buttons) {
        button.addEventListener("click", openPopup);
    }
}

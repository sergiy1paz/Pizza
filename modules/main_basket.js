import { Basket } from "./models/basket.js";

const basket = new Basket();
basket.render();

document.getElementById("order").addEventListener("click", (e) => {
    basket.clear();
});

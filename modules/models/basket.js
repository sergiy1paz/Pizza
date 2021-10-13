import { Menu } from "./menu.js";

export class Basket {

    render() {
        const orders = this.#get_orders();
        const orderBody = document.querySelector(".orders-body");

        if (orderBody) {
            if (orders === null || orders.length === 0) {
                if (orderBody.children.length === 0) {
                    orderBody.appendChild(this.#show_message());
                }
            } else {
                for (const order of orders) {
                    orderBody.appendChild(this.#create_ui_order(order));
                }
                this.#update_ui_total_price();
                this.#remove_order_handle(orderBody);
            }
        }
    }

    clear() {
        localStorage.removeItem("orders");
        const orderBody = document.querySelector(".orders-body");
        orderBody.innerHTML = "";
        orderBody.appendChild(this.#show_message());
        document.getElementById("total_price").innerText = 0;
        document.getElementById("remove_item").disabled = true;
    }

    #remove_order_handle(orderBody) {
        let target;
        orderBody.addEventListener("click", (e) => {
            if (e.target.className === "order") {
                target = e.target;

                const removeButton = document.getElementById("remove_item");
                removeButton.disabled = false;
                removeButton.addEventListener("click", (it) => {
                    orderBody.removeChild(target);
                    it.target.disabled = true;

                    // delete from storage
                    let storageIsEmpty = this.#remove_order_from_storage(target);
                    if (storageIsEmpty) {
                        orderBody.appendChild(this.#show_message());
                    }
                });

            }
        });
    }

    #remove_order_from_storage(target) {
        const currentOrder = this.#parseToOrder(target);

        let orders = JSON.parse(localStorage.getItem("orders"));
       
        for (let i = 0; i < orders.length; i++) {
            if (this.#orderEquals(orders[i], currentOrder)) {
                orders[i] = null;
                break;
            }
        }

        orders = orders.filter(el => el !== null);

        if (orders.length === 0) {
            localStorage.removeItem("orders");
            return true;
        } else {
            localStorage.setItem("orders", JSON.stringify(orders));
            return false;
        }
    }


    #show_message() {
        const messageBox = document.createElement("div");
        messageBox.className = "message-box";

        const message = document.createElement("p");
        message.className = "message";
        message.innerText = "You do not have some orders...";

        messageBox.appendChild(message);

        return messageBox;
    }


    #create_ui_order({ pizza_type, ingredients }) {
        const orderDiv = document.createElement("div");
        orderDiv.className = "order";

        const pizzaName = document.createElement("h3");
        pizzaName.className = "pizza-name";
        pizzaName.innerText = pizza_type.toUpperCase();
        orderDiv.appendChild(pizzaName);


        const ingredientsBody = document.createElement("div");
        ingredientsBody.className = "ingredients-body";

        for (const ingredientName of ingredients) {
            const ingredient = document.createElement("span");
            ingredient.className = "ingredient";
            ingredient.innerText = ingredientName;

            ingredientsBody.appendChild(ingredient);
        }
        orderDiv.appendChild(ingredientsBody);

        const price = document.createElement("h3");
        price.className = "price";
        price.innerText = this.#count_price(pizza_type, ingredients);
        orderDiv.appendChild(price);

        return orderDiv;
    }

    #update_ui_total_price() {
        document.getElementById("total_price").innerText = this.#count_total_price();
    }

    #count_price(pizza_type, ingredients) {
        let price = Menu.pizzas.get(pizza_type);

        for (const ingredient of ingredients) {
            price += Menu.ingredients.get(ingredient);
        }

        return price;
    }



    #count_total_price() {
        const prices = document.querySelectorAll(".price");
        let total_price = 0;
        for (const price of prices) {
            total_price += parseInt(price.innerText);
        }
        return total_price;
    }


    #get_orders() {
        return JSON.parse(localStorage.getItem("orders"));
    }

    #parseToOrder(target) {
        const order = {};

        for (const child of target.children) {
            switch (child.className) {
                case "pizza-name":
                    order.pizza_type = child.innerText.toLowerCase();
                    break;
                case "ingredients-body":
                    order.ingredients = [];
                    for (const ingredient of child.children) {
                        order.ingredients.push(ingredient.innerText);
                    }
                    break;
            }
        }

        return order;
    }

    #orderEquals(a, b) {
        if (a.pizza_type === b.pizza_type) {
            if (a.ingredients.length === b.ingredients.length) {
                for (let i = 0; i < a.ingredients.length; i++) {
                    if (a.ingredients[i] !== b.ingredients[i]) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            return false;
        }

    }
}
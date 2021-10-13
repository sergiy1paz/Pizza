export class Order {
    #pizza_type;

    constructor(pizza_type) {
        this.#pizza_type = pizza_type;
    }

    save() {
        const order = {
            pizza_type: this.#pizza_type,
            ingredients: this.#set_ingredients()
        }
        this.#save_in_storage(order);
    }

    #set_ingredients() {
        const ingredientsForm = document.forms["ingredients"];
        let ingredientsList = [];
        for (const ingredient of ingredientsForm.elements) {
            if (ingredient.checked) {
                ingredientsList.push(ingredient.value);
            }
        }
        return ingredientsList;
    }

    #save_in_storage(order) {
        let orders = JSON.parse(localStorage.getItem("orders"));

        if (orders) {
            orders.push(order);
        } else {
            orders = [order];
        }

        localStorage.setItem("orders", JSON.stringify(orders));
    }
}
"use strict";

// define a function that gets an HTML element
function getElement(selector) { 
    return document.querySelector(selector);
}

// define a function that handles the click event of the Join button
function calculateButtonClick(event) {
    // Hard coded rates
    const TAX_RATE = 0.0825;
    const DISCOUNT_RATE = 0.10;

    // get user entries from text boxes
    const customer_name = getElement("#customer_name").value;
    const grocery_item = getElement("#grocery_item").value;

    // Not constant since we need to parse it
    let unit_price = getElement("#unit_price").value;
    let quantity = getElement("#quantity").value;
    let cash = getElement("#cash").value;
    
    // check user entries
    let invalid = false;
    if (customer_name === "") {
        getElement("#customer_name_error").textContent = "Required";
        invalid = true;
    } else { 
        getElement("#customer_name_error").textContent = "";
    }

    if (grocery_item === "") {
        getElement("#grocery_item_error").textContent = "Required";
        invalid = true;
    } else { 
        getElement("#grocery_item_error").textContent = "";
    }

    // First we check to see if it's an empty input before we parse it to a number
    // This is because an empty string parsed to a number becomes 0
    if (unit_price === "") {
        getElement("#unit_price_error").textContent = "Required";
        invalid = true;
    } else {  // Parse it to a number then do more checks
        unit_price = Number(unit_price)

        if (isNaN(unit_price)) {
            getElement("#unit_price_error").textContent = "Must be numeric";
            invalid = true;
        } else if (unit_price < 0) {
            getElement("#unit_price_error").textContent = "Must be greater than or equal to 0";
            invalid = true;
        } else {
            getElement("#unit_price_error").textContent = "";
        }
    }

    if (quantity === "") {
        getElement("#quantity_error").textContent = "Required";
        invalid = true;
    } else if (!isFinite(cash)) {  // Check for infinities because math can't be done on them
        getElement("#cash_error").textContent = "Number too high";
        invalid = true;
    } else {  // Parse it to a number then do more checks
        // Rather than designing an error message for floating point quantities we will instead just floor it
        quantity = Math.floor(Number(quantity));

        if (isNaN(quantity)) {
            getElement("#quantity_error").textContent = "Must be numeric";
            invalid = true;
        } else if (!isFinite(cash)) {  // Check for infinities because math can't be done on them
            getElement("#cash_error").textContent = "Number too high";
            invalid = true;
        } else if (quantity < 0) {
            getElement("#quantity_error").textContent = "Must be greater than or equal to 0";
            invalid = true;
        } else {
            getElement("#quantity_error").textContent = "";
        }
    }

    if (cash === "") {
        getElement("#cash_error").textContent = "Required";
        invalid = true;
    } else {  // Parse it to a number then do more checks
        cash = Number(cash);

        if (isNaN(cash)) {
            getElement("#cash_error").textContent = "Must be numeric";
            invalid = true;
        } else if (!isFinite(cash)) {  // Check for infinities because math can't be done on them
          getElement("#cash_error").textContent = "Number too high";
          invalid = true;
        } else if (cash < 0) {
            getElement("#cash_error").textContent = "Must be greater than or equal to 0";
            invalid = true;
        } else {
            getElement("#cash_error").textContent = "";
        }
    }

    // Calculate our values
    let subtotal = unit_price * quantity;
    let discount = (subtotal >= 50) ? subtotal * DISCOUNT_RATE : 0;
    let tax = (subtotal - discount) * TAX_RATE;
    let total = subtotal + tax - discount;
    let change = cash - total;

    if (!isFinite(subtotal)) {
        alert("Subtotal too high");
        invalid = true;
    }

    if (!isFinite(total)) {
        alert("Total too high");
        invalid = true;
    }

    if (change < 0) {
        alert("You do not have the funds necessary for this purchase")
        invalid = true;
    }

    subtotal = subtotal.toFixed(2);
    unit_price = unit_price.toFixed(2);
    tax = tax.toFixed(2);
    total = total.toFixed(2);
    change = change.toFixed(2);
    cash = cash.toFixed(2);

    const receipt =
        `
        ========Receipt========
        Customer: ${customer_name}
        Item: ${grocery_item}
        Unit Price: $${unit_price}
        Quantity: ${quantity}
        ----------
        Subtotal: $${subtotal}
        Discount: -$${discount}
        Tax: $${tax}
        Total: $${total}
        ----------
        Cash: $${cash}
        Change: $${change}
        =====End of Receipt=====
        `;





    // cancel form submit if any user entries are invalid
    if (invalid) {
        event.preventDefault();
        return;
    }

    alert(receipt);
}

// add code that's run when the web page is loaded
document.addEventListener("DOMContentLoaded", () => {
    // specify the function that's run when the Join button is clicked
    getElement("#submit_button").addEventListener("click",calculateButtonClick);
});
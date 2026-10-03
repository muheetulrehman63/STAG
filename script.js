"use strict";

/* =================================
   STAG SHOPPING CART
================================= */

let cart = [];

const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

/* =================================
   OPEN CART
================================= */

function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

/* =================================
   CLOSE CART
================================= */

function closeCart() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

/* =================================
   ADD TO CART
================================= */

document.querySelectorAll(".add-cart").forEach(function(button) {

    button.addEventListener("click", function() {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingProduct = cart.find(function(item) {
            return item.name === name;
        });

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        updateCart();

        openCart();
    });

});

/* =================================
   UPDATE CART
================================= */

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "0";

        return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(function(item, index) {

        totalItems += item.quantity;

        totalPrice += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>

                <div class="cart-item-price">
                    Rs. ${item.price.toLocaleString()}
                </div>

                <div class="quantity-controls">

                    <button
                        type="button"
                        class="minus-button"
                        data-index="${index}">
                        −
                    </button>

                    <strong>${item.quantity}</strong>

                    <button
                        type="button"
                        class="plus-button"
                        data-index="${index}">
                        +
                    </button>

                    <button
                        type="button"
                        class="remove-item"
                        data-index="${index}">
                        Remove
                    </button>

                </div>
            </div>

            <strong>
                Rs. ${(item.price * item.quantity).toLocaleString()}
            </strong>
        `;

        cartItems.appendChild(cartItem);
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice.toLocaleString();

    addCartControlEvents();
}

/* =================================
   CART CONTROL EVENTS
================================= */

function addCartControlEvents() {

    document.querySelectorAll(".plus-button").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            cart[index].quantity += 1;

            updateCart();
        });

    });

    document.querySelectorAll(".minus-button").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }

            updateCart();
        });

    });

    document.querySelectorAll(".remove-item").forEach(function(button) {

        button.addEventListener("click", function() {

            const index = Number(button.dataset.index);

            cart.splice(index, 1);

            updateCart();
        });

    });
}

/* =================================
   WHATSAPP CHECKOUT
================================= */

checkoutButton.addEventListener("click", function() {

    if (cart.length === 0) {

        alert("Your cart is empty. Please add a product first.");

        return;
    }

    let message = "Hello STAG! I want to place an order:%0A%0A";

    let total = 0;

    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        message +=
            "• " +
            item.name +
            " x " +
            item.quantity +
            " = Rs. " +
            itemTotal.toLocaleString() +
            "%0A";
    });

    message +=
        "%0A*Total: Rs. " +
        total.toLocaleString() +
        "*";

    const whatsappURL =
        "https://wa.me/+923278010986?text=" + message;

    window.open(whatsappURL, "_blank");
});

/* =================================
   CUSTOM POPUP
================================= */

const customPopup = document.getElementById("customPopup");
const closePopupButton = document.getElementById("closePopup");

/* Show popup after 2 seconds */

window.addEventListener("load", function() {

    setTimeout(function() {

        customPopup.classList.add("show");

    }, 2000);

});

/* Close popup */

closePopupButton.addEventListener("click", function() {

    customPopup.classList.remove("show");

});

/* Close popup by clicking outside */

customPopup.addEventListener("click", function(event) {

    if (event.target === customPopup) {

        customPopup.classList.remove("show");
    }

});

/* =================================
   ESCAPE KEY
================================= */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeCart();

        customPopup.classList.remove("show");
    }

});

/* =================================
   INITIAL CART
================================= */

updateCart();
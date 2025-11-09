async function addToCart(productId) {
  const quantityInput = document.getElementById("quantity");
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    if (response.ok) {
      alert(`${quantity} producto(s) agregado(s) al carrito`);
      updateCartCount();
    } else {
      alert("Error al agregar el producto");
    }
  } catch (error) {
    alert("Error al agregar el producto al carrito");
  }
}

async function updateCartCount() {
  try {
    const response = await fetch(`/api/carts/${cartId}`);
    const data = await response.json();

    const count = data.payload.products
      ? data.payload.products.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

    const cartCounter = document.getElementById("cart-count");
    if (cartCounter) cartCounter.textContent = count;
  } catch (error) {
    console.error("Error al actualizar contador del carrito:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const viewCartBtn = document.getElementById("viewCartBtn");
  if (viewCartBtn) {
    viewCartBtn.href = `/carts/${cartId}`;
    viewCartBtn.style.display = "inline-block";
  }

  const limitSelect = document.getElementById("limit");
  if (limitSelect) {
    limitSelect.addEventListener("change", () => {
      document.getElementById("filtersForm").submit();
    });
  }

  const sortSelect = document.getElementById("sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      document.getElementById("filtersForm").submit();
    });
  }

  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      addToCart(id);
    });
  });

  updateCartCount();
});

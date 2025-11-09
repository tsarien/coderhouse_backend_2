async function updateCartLink() {
  const cartCount = document.getElementById("cart-count");

  try {
    const response = await fetch(`/api/carts/${cartId}`);
    const data = await response.json();

    if (data.status === "success") {
      const totalItems = data.payload.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "inline-block" : "none";
    }
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
  }
}

updateCartLink();

async function updateQuantity(cartId, productId, currentQuantity, change) {
  const newQuantity = currentQuantity + change;

  if (newQuantity < 1) {
    if (confirm("¿Deseas eliminar este producto del carrito?")) {
      await removeFromCart(cartId, productId);
    }
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      location.reload();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "No se pudo actualizar la cantidad"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar la cantidad. Verifica tu conexión.");
  }
}

async function updateQuantityInput(cartId, productId, newQuantity) {
  newQuantity = parseInt(newQuantity);

  if (isNaN(newQuantity) || newQuantity < 1) {
    alert("La cantidad debe ser un número mayor a 0");
    location.reload();
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (response.ok) {
      location.reload();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "No se pudo actualizar la cantidad"}`);
      location.reload();
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al actualizar la cantidad. Verifica tu conexión.");
    location.reload();
  }
}

async function removeFromCart(cartId, productId) {
  if (!confirm("¿Estás seguro de eliminar este producto del carrito?")) {
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      location.reload();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "No se pudo eliminar el producto"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al eliminar el producto. Verifica tu conexión.");
  }
}

async function clearCart(cartId) {
  if (!confirm("¿Estás seguro de vaciar todo el carrito?")) {
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      location.reload();
    } else {
      const error = await response.json();
      alert(`Error: ${error.message || "No se pudo vaciar el carrito"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al vaciar el carrito. Verifica tu conexión.");
  }
}

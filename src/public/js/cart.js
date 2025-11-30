async function updateCartLink() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  // Validar cartId de forma más eficiente
  if (!cartId || cartId === "null" || cartId === "undefined" || !cartId.trim()) {
    cartCount.style.display = "none";
    return;
  }

  try {
    const response = await fetch(`/api/carts/${cartId}`);
    if (!response.ok) throw new Error("Error en la respuesta");
    
    const data = await response.json();
    if (data.status === "success" && data.payload?.products) {
      const totalItems = data.payload.products.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "inline-block" : "none";
    } else {
      cartCount.style.display = "none";
    }
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    cartCount.style.display = "none";
  }
}

// Solo ejecutar si cartId está definido
if (typeof cartId !== "undefined" && cartId) {
  updateCartLink();
}

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

async function generateTicket() {
  if (!confirm("¿Confirmas que deseas finalizar la compra?")) {
    return;
  }

  // Obtener el botón y deshabilitarlo para evitar múltiples clicks
  const checkoutButton = document.querySelector(".btn-checkout");
  const originalText = checkoutButton?.textContent || "🎉 Finalizar Compra";
  
  if (checkoutButton) {
    checkoutButton.disabled = true;
    checkoutButton.textContent = "⏳ Procesando...";
    checkoutButton.style.opacity = "0.6";
    checkoutButton.style.cursor = "not-allowed";
  }

  try {
    const response = await fetch("/api/ticket/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      // Mostrar mensaje de éxito antes de redirigir
      if (checkoutButton) {
        checkoutButton.textContent = "✅ ¡Compra exitosa!";
        checkoutButton.style.opacity = "1";
      }
      // Pequeño delay para que el usuario vea el feedback y luego redirigir al home
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } else {
      if (checkoutButton) {
        checkoutButton.disabled = false;
        checkoutButton.textContent = originalText;
        checkoutButton.style.opacity = "1";
        checkoutButton.style.cursor = "pointer";
      }
      alert(`Error: ${data.error || "No se pudo generar el ticket"}`);
    }
  } catch (error) {
    console.error("Error:", error);
    if (checkoutButton) {
      checkoutButton.disabled = false;
      checkoutButton.textContent = originalText;
      checkoutButton.style.opacity = "1";
      checkoutButton.style.cursor = "pointer";
    }
    alert("Error al generar el ticket. Verifica tu conexión.");
  }
}

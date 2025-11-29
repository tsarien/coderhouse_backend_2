// Reset Password Form Handler
const resetPasswordForm = document.getElementById("resetPasswordForm");
const messageDiv = document.getElementById("message");

if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const submitBtn = resetPasswordForm.querySelector('button[type="submit"]');

    messageDiv.innerHTML = "";

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      messageDiv.innerHTML = `
        <p style="color: var(--color-danger); font-weight: 600;">
          ❌ Las contraseñas no coinciden
        </p>
      `;
      return;
    }

    // Deshabilitar botón y mostrar loading
    submitBtn.disabled = true;
    submitBtn.textContent = "Actualizando...";

    try {
      const response = await fetch(`/api/sessions/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.innerHTML = `
          <p style="color: var(--color-success); font-weight: 600;">
            ✅ ${data.message || "Contraseña actualizada correctamente"}
          </p>
          <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
            Redirigiendo al login...
          </p>
        `;
        
        // Redireccionar al login después de 2 segundos
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        messageDiv.innerHTML = `
          <p style="color: var(--color-danger); font-weight: 600;">
            ❌ ${data.message || "Error al actualizar la contraseña"}
          </p>
        `;
        submitBtn.disabled = false;
        submitBtn.textContent = "Restablecer contraseña";
      }
    } catch (error) {
      console.error("Error:", error);
      messageDiv.innerHTML = `
        <p style="color: var(--color-danger); font-weight: 600;">
          ❌ Error de conexión. Verifica tu internet.
        </p>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = "Restablecer contraseña";
    }
  });
}

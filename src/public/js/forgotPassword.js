const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const messageDiv = document.getElementById("message");

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = "Enviando...";
    messageDiv.innerHTML = "";

    try {
      const response = await fetch("/api/sessions/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        messageDiv.innerHTML = `
          <p style="color: var(--color-success); font-weight: 600;">
            ✅ ${data.message || "Correo enviado exitosamente"}
          </p>
          <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>
        `;
        forgotPasswordForm.reset();
      } else {
        messageDiv.innerHTML = `
          <p style="color: var(--color-danger); font-weight: 600;">
            ❌ ${data.message || "Error al enviar el correo"}
          </p>
        `;
      }
    } catch (error) {
      console.error("Error:", error);
      messageDiv.innerHTML = `
        <p style="color: var(--color-danger); font-weight: 600;">
          ❌ Error de conexión.
        </p>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar enlace de recuperación";
    }
  });
}

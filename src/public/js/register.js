// Manejo del formulario de registro
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const first_name = document.getElementById("first_name").value;
      const last_name = document.getElementById("last_name").value;
      const email = document.getElementById("email").value;
      const age = document.getElementById("age").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/sessions/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            first_name,
            last_name,
            email,
            age: age ? parseInt(age) : undefined,
            password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Registro exitoso. Por favor, inicia sesión.");
          window.location.href = "/login";
        } else {
          alert(data.error || "Error al registrarse");
        }
      } catch (error) {
        console.error("Error al registrarse:", error);
        alert("Error al registrarse. Por favor, intenta nuevamente.");
      }
    });
  }
});

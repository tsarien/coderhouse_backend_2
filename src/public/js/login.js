// Manejo del botón de logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const response = await fetch("/api/sessions/logout", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          // Redirigir a la página principal después del logout
          window.location.href = "/";
        } else {
          const data = await response.json();
          alert(data.error || "Error al cerrar sesión");
        }
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        alert("Error al cerrar sesión. Por favor, intenta nuevamente.");
      }
    });
  }

  // Manejo del formulario de login si existe
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("/api/sessions/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Redirigir a la página principal después del login exitoso
          window.location.href = "/";
        } else {
          alert(data.error || "Error al iniciar sesión");
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Error al iniciar sesión. Por favor, intenta nuevamente.");
      }
    });
  }
});


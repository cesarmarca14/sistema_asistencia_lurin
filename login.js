document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();

  // Credenciales válidas (puedes modificarlas)
  const usuarioValido = "cesar";
  const passwordValido = "1";

  if (usuario === usuarioValido && password === passwordValido) {
    // Guarda el usuario en localStorage (para mantener sesión si lo deseas)
    localStorage.setItem("usuario", usuario);

    alert("✅ Bienvenido, " + usuario + ". Redirigiendo al sistema...");
    // Espera 1 segundo antes de redirigir
    setTimeout(() => {
      window.location.href = "cursos.html"; // redirige al sistema principal
    }, 1000);
  } else {
    alert("❌ Credenciales incorrectas. Intenta de nuevo.");
  }
});

localStorage.setItem('profesorLogeado', JSON.stringify({ nombre: 'Juan Pérez' }));



  // Evita que ingresen sin sesión
  if (!localStorage.getItem("usuario")) {
    alert("🔒 Acceso restringido. Debes iniciar sesión.");
    window.location.href = "login.html";
  }


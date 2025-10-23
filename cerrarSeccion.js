


  function cerrarSesion() {
    localStorage.removeItem("usuario");
    alert("👋 Sesión cerrada correctamente");
    window.location.href = "login.html";
  }


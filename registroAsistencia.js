const scriptURL = "https://script.google.com/macros/s/AKfycbwd6u3HYdsVCSjdUXuZSbWtTfXskkef3tA9UBKzDYia9vE2ZhBKZlH1wew1EL0ommRT/exec";

// --- Recuperar datos del curso seleccionado ---
const seleccion = JSON.parse(localStorage.getItem("cursoSeleccionado"));
const curso = seleccion ? seleccion.cursoId : null;
const sesion = seleccion ? seleccion.sesion : null;

if (!curso || !sesion) {
  alert("No se encontró información del curso seleccionado.");
  window.location.href = "cursos.html";
}

document.getElementById("tituloCurso").textContent = `Registro de Asistencia - Curso ${curso}`;
document.getElementById("infoSesion").textContent = `Semana ${sesion}`;

// --- Simulación de 12 alumnos ---
const alumnos = [
  "Carlos Pérez", "María López", "José Ramírez", "Ana Torres",
  "Luis Mendoza", "Elena Vargas", "Pedro Gutiérrez", "Lucía Castro",
  "Miguel Díaz", "Rosa Fernández", "Mario Paredes", "Patricia Rojas"
];

// --- Crear tabla con checkboxes ---
const tbody = document.querySelector("#tablaAlumnos tbody");
alumnos.forEach((nombre, index) => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${index + 1}</td>
    <td>${nombre}</td>
    <td><input type="checkbox" id="presente_${index}" value="Presente"></td>
    <td><input type="checkbox" id="ausente_${index}" value="Ausente"></td>
  `;
  tbody.appendChild(fila);

  const chkPresente = fila.querySelector(`#presente_${index}`);
  const chkAusente = fila.querySelector(`#ausente_${index}`);

  chkPresente.addEventListener("change", () => {
    if (chkPresente.checked) chkAusente.checked = false;
  });
  chkAusente.addEventListener("change", () => {
    if (chkAusente.checked) chkPresente.checked = false;
  });
});

// --- Guardar asistencia ---
document.getElementById("guardarAsistencia").addEventListener("click", () => {
  const registros = alumnos.map((nombre, i) => {
    let estado = "No marcado";
    if (document.getElementById(`presente_${i}`).checked) estado = "Presente";
    if (document.getElementById(`ausente_${i}`).checked) estado = "Ausente";
    return { alumno: nombre, estado };
  });

  const data = {
    cursoId: curso,
    sesion,
    fecha: new Date().toLocaleDateString("es-PE"),
    asistencia: registros
  };

  // Guardar localmente para pruebas
  localStorage.setItem(`asistencia_${curso}_${sesion}`, JSON.stringify(data));

  // Enviar al script de Google
  fetch(scriptURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(async (res) => {
    const result = await res.json();
    if (result.success) {
      alert("✅ Asistencia registrada correctamente.");
      window.location.href = "cursos.html";
    } else {
      alert("❌ Error al registrar la asistencia: " + result.error);
    }
  })
  .catch((error) => {
    console.error("Fetch error:", error);
    alert("❌ No se pudo conectar con el servidor de Google.");
  });
});

// --- Volver sin guardar ---
document.getElementById("volver").addEventListener("click", () => {
  window.location.href = "cursos.html";
});

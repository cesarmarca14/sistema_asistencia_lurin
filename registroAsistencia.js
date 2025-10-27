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

// --- Simulación de 12 alumnos inscritos ---
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
    <td><input type="checkbox" id="presente_${index}" name="asistencia_${index}" value="Presente"></td>
    <td><input type="checkbox" id="ausente_${index}" name="asistencia_${index}" value="Ausente"></td>
  `;
  tbody.appendChild(fila);

  // Hacer que solo se pueda marcar uno (Presente o Ausente)
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
    fecha: new Date().toLocaleDateString(),
    asistencia: registros
  };

  // Guardar localmente (para pruebas)
  localStorage.setItem(`asistencia_${curso}_${sesion}`, JSON.stringify(data));

  // Enviar a Google Sheets (cuando pongas tu Script ID)
  fetch("https://script.google.com/macros/s/AKfycbwy-fydKEIwXiZQ6LVlCfn5p3kF-AelOKR6B0_FQHTtIVo8eD0QvYxOSEnN-70SPalA/exec   ", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  alert("✅ Asistencia registrada correctamente.");
  window.location.href = "cursos.html";
});

// --- Volver sin guardar ---
document.getElementById("volver").addEventListener("click", () => {
  window.location.href = "cursos.html";
});

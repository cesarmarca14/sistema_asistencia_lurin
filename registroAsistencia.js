// --- Recuperar datos del curso seleccionado ---
const seleccion = JSON.parse(localStorage.getItem("cursoSeleccionado"));
const cursoId = seleccion ? seleccion.cursoId : null;
const cursoNombre = seleccion ? seleccion.cursoNombre : null; // ✅ Nuevo
const sesion = seleccion ? seleccion.sesion : null;

if (!cursoId || !sesion || !cursoNombre) {
  alert("No se encontró información del curso seleccionado.");
  window.location.href = "cursos.html";
}

// ✅ Muestra el nombre real del curso
document.getElementById("tituloCurso").textContent = `Registro de Asistencia - ${cursoNombre}`;
document.getElementById("infoSesion").textContent = `Semana ${sesion}`;

// --- Controlar selección de sede ---
const sedeSelect = document.getElementById("sede");
sedeSelect.addEventListener("change", () => {
  if (sedeSelect.value) {
    sedeSelect.classList.add("selected"); // Aplica color cuando se elige
  } else {
    sedeSelect.classList.remove("selected");
  }
});

// --- Simulación de 12 alumnos ---
const alumnos = [
  "Carlos Pérez", "María López", "José Ramírez", "Ana Torres",
  "Luis Mendoza", "Elena Vargas", "Pedro Gutiérrez", "Lucía Castro",
  "Miguel Díaz", "Rosa Fernández", "Mario Paredes", "Patricia Rojas"
];

const tbody = document.querySelector("#tablaAlumnos tbody");

// --- Crear tabla ---
alumnos.forEach((nombre, index) => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${index + 1}</td>
    <td>${nombre}</td>
    <td><input type="checkbox" id="presente_${index}" value="Presente"></td>
    <td><input type="checkbox" id="ausente_${index}" value="Ausente" checked></td>
  `;
  tbody.appendChild(fila);

  const chkPresente = fila.querySelector(`#presente_${index}`);
  const chkAusente = fila.querySelector(`#ausente_${index}`);

  chkPresente.addEventListener("change", () => {
    chkAusente.checked = !chkPresente.checked;
  });

  chkAusente.addEventListener("change", () => {
    chkPresente.checked = !chkAusente.checked;
  });
});

// --- Guardar asistencia ---
document.getElementById("guardarAsistencia").addEventListener("click", () => {
  if (!sedeSelect.value) {
    alert("Por favor selecciona una sede antes de guardar.");
    return;
  }

  // ✅ Guardar la sede seleccionada
  localStorage.setItem("sedeSeleccionada", sedeSelect.value);

  const registros = alumnos.map((nombre, i) => {
    let estado = "Ausente";
    if (document.getElementById(`presente_${i}`).checked) estado = "Presente";
    return { alumno: nombre, estado };
  });

  const data = {
    cursoId,
    cursoNombre, // ✅ Se envía el nombre real del curso
    sesion,
    sede: sedeSelect.value,
    fecha: new Date().toLocaleDateString("es-PE"),
    asistencia: registros
  };

  // --- Guardar localmente ---
  localStorage.setItem(`asistencia_${cursoId}_${sesion}`, JSON.stringify(data));

  // --- Enviar a Google Sheets ---
  fetch("https://script.google.com/macros/s/AKfycbwy-fydKEIwXiZQ6LVlCfn5p3kF-AelOKR6B0_FQHTtIVo8eD0QvYxOSEnN-70SPalA/exec", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(() => {
    alert(`✅ Asistencia registrada correctamente en la sede ${sedeSelect.value}.`);
    window.location.href = "verAsistencia.html"; // Redirige a la vista
  })
  .catch((error) => {
    console.error("Error al registrar asistencia:", error);
    alert("❌ No se pudo registrar la asistencia.");
  });
});

// --- Botón volver ---
document.getElementById("volver").addEventListener("click", () => {
  window.location.href = "cursos.html";
});

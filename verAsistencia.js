// --- URL del Google Apps Script ---
const scriptURL = "https://script.google.com/macros/s/AKfycbwy-fydKEIwXiZQ6LVlCfn5p3kF-AelOKR6B0_FQHTtIVo8eD0QvYxOSEnN-70SPalA/exec";

// --- Recuperar datos del curso seleccionado ---
const seleccion = JSON.parse(localStorage.getItem("cursoSeleccionado"));
const curso = seleccion ? seleccion.cursoId : null;
const sesion = seleccion ? seleccion.sesion : null;

document.getElementById("tituloCurso").textContent = `Asistencia del Curso ${curso || ''}`;
document.getElementById("infoSesion").textContent = sesion ? `Sesión ${sesion}` : "";

// --- Cargar todas las asistencias ---
async function cargarAsistencia() {
  try {
    const url = `${scriptURL}?cursoId=${curso || ""}&sesion=${sesion || ""}`;
    const res = await fetch(url);
    const data = await res.json();

    const tbody = document.querySelector("#tablaAsistencia tbody");
    tbody.innerHTML = "";

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No hay registros de asistencia.</td></tr>`;
      return;
    }

    data.forEach((fila, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${fila.alumno}</td>
        <td>${fila.estado}</td>
        <td>${fila.fecha}</td>
        <td>
          <button class="btnEliminar" onclick="eliminarAsistencia('${fila.cursoId}', '${fila.sesion}', '${fila.alumno}')">
            🗑️
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    alert("❌ Ocurrió un error al obtener los datos de asistencia.");
  }
}

// --- Eliminar asistencia individual ---
async function eliminarAsistencia(cursoId, sesion, alumno) {
  if (!confirm(`¿Seguro que deseas eliminar la asistencia de ${alumno}?`)) return;

  try {
    const res = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "eliminar",
        cursoId,
        sesion,
        alumno
      })
    });

    const mensaje = await res.text();
    alert(mensaje);
    cargarAsistencia(); // Actualiza la tabla
  } catch (error) {
    console.error(error);
    alert("❌ Error al eliminar el registro.");
  }
}

// --- Botón volver ---
document.getElementById("volver").addEventListener("click", () => {
  window.location.href = "cursos.html";
});

// --- Cargar datos al iniciar ---
cargarAsistencia();

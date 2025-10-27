// --- URL del Google Apps Script ---
const scriptURL = "https://script.google.com/macros/s/AKfycbwy-fydKEIwXiZQ6LVlCfn5p3kF-AelOKR6B0_FQHTtIVo8eD0QvYxOSEnN-70SPalA/exec";

// --- Recuperar datos del curso seleccionado ---
const seleccion = JSON.parse(localStorage.getItem("cursoSeleccionado"));
const curso = seleccion ? seleccion.cursoId : null;
const sesion = seleccion ? seleccion.sesion : null;

document.getElementById("tituloCurso").textContent = `Asistencia del Curso ${curso || ''}`;
document.getElementById("infoSesion").textContent = sesion ? `Sesión ${sesion}` : "";

// --- Variable global ---
let datosAsistencia = [];

// --- Cargar asistencias ---
async function cargarAsistencia() {
  try {
    const url = `${scriptURL}?cursoId=${curso || ""}&sesion=${sesion || ""}`;
    const res = await fetch(url);
    const data = await res.json();

    // --- Filtrar registros válidos (por si hay vacíos) ---
    const registrosValidos = data.filter(fila => fila.alumno && fila.estado);

    datosAsistencia = registrosValidos; // Guardar para exportar

    const tbody = document.querySelector("#tablaAsistencia tbody");
    tbody.innerHTML = ""; // limpiar

    if (registrosValidos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">No hay registros de asistencia.</td></tr>`;
      document.getElementById("totalRegistros").textContent = "0";
      return;
    }

    registrosValidos.forEach((fila, index) => {
      const tr = document.createElement("tr");

      // --- Número ---
      const tdNro = document.createElement("td");
      tdNro.textContent = index + 1;

      // --- Alumno ---
      const tdAlumno = document.createElement("td");
      tdAlumno.textContent = fila.alumno;

      // --- Estado ---
      const tdEstado = document.createElement("td");
      tdEstado.textContent = fila.estado;

      // Fondo rojo si es Ausente
      if (fila.estado.toLowerCase() === "ausente") {
        tdEstado.style.backgroundColor = "#fb7b7b";
        tdEstado.style.color = "#333"; // mantiene color de texto igual
        tdEstado.style.fontWeight = "bold";
      }

      // --- Fecha ---
      const tdFecha = document.createElement("td");
      tdFecha.textContent = fila.fecha
        ? new Date(fila.fecha).toLocaleDateString("es-PE")
        : "";

      // --- Agregar ---
      tr.appendChild(tdNro);
      tr.appendChild(tdAlumno);
      tr.appendChild(tdEstado);
      tr.appendChild(tdFecha);
      tbody.appendChild(tr);
    });

    // Mostrar total
    document.getElementById("totalRegistros").textContent = registrosValidos.length;
  } catch (error) {
    console.error(error);
    alert("❌ Ocurrió un error al obtener los datos de asistencia.");
  }
}

// --- Descargar Excel ---
function descargarExcel() {
  if (datosAsistencia.length === 0) {
    alert("No hay datos para descargar.");
    return;
  }

  const datos = datosAsistencia.map((fila, index) => ({
    Nro: index + 1,
    Alumno: fila.alumno,
    Estado: fila.estado,
    Fecha: fila.fecha ? new Date(fila.fecha).toLocaleDateString("es-PE") : ""
  }));

  const ws = XLSX.utils.json_to_sheet(datos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
  XLSX.writeFile(wb, `Asistencia_${curso || "curso"}_Sesion_${sesion || ""}.xlsx`);
}

// --- Botones ---
document.getElementById("volver").addEventListener("click", () => {
  window.location.href = "cursos.html";
});
document.getElementById("descargarExcel").addEventListener("click", descargarExcel);

// --- Cargar al iniciar ---
cargarAsistencia();

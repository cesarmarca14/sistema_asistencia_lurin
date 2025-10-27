const scriptURL = "https://script.google.com/macros/s/AKfycbwd6u3HYdsVCSjdUXuZSbWtTfXskkef3tA9UBKzDYia9vE2ZhBKZlH1wew1EL0ommRT/exec";

const seleccion = JSON.parse(localStorage.getItem("cursoSeleccionado"));
const nombreCurso = seleccion ? seleccion.nombreCurso : "Curso sin nombre";
const sesion = seleccion ? seleccion.sesion : null;

document.getElementById("tituloCurso").textContent = `Asistencia del curso: ${nombreCurso}`;
document.getElementById("infoSesion").textContent = sesion ? `Semana ${sesion}` : "";

let asistencias = [];
let cambiosPendientes = false;

// --- Cargar la tabla (solo 12 alumnos) ---
async function cargarAsistencia() {
  try {
    const url = `${scriptURL}?nombreCurso=${encodeURIComponent(nombreCurso)}&sesion=${sesion || ""}`;
    const res = await fetch(url);
    const data = await res.json();

    // Limitar a 12 alumnos
    asistencias = data.slice(0, 12);

    const tbody = document.querySelector("#tablaAsistencia tbody");
    tbody.innerHTML = "";

    if (asistencias.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4">No hay registros de asistencia.</td></tr>`;
      return;
    }

    asistencias.forEach((fila, index) => {
      const fecha = new Date(fila.fecha);
      const fechaFormateada = isNaN(fecha)
        ? fila.fecha
        : fecha.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${fila.alumno}</td>
        <td class="estado ${fila.estado === "Ausente" ? "ausente" : ""}">${fila.estado}</td>
        <td>${fechaFormateada}</td>
      `;
      tbody.appendChild(tr);

      const tdEstado = tr.querySelector(".estado");
      tdEstado.addEventListener("click", () => {
        fila.estado = fila.estado === "Presente" ? "Ausente" : "Presente";
        tdEstado.textContent = fila.estado;
        tdEstado.classList.toggle("ausente", fila.estado === "Ausente");
        cambiosPendientes = true;
        document.getElementById("guardarCambios").disabled = false;
      });
    });

  } catch (error) {
    console.error(error);
    alert("❌ Ocurrió un error al obtener los datos de asistencia.");
  }
}

// --- Descargar CSV ---
document.getElementById("descargarExcel").addEventListener("click", () => {
  if (asistencias.length === 0) {
    alert("⚠️ No hay datos para descargar.");
    return;
  }

  const encabezados = ["#", "Alumno", "Estado", "Fecha"];
  const filas = asistencias.map((a, i) => {
    const fecha = new Date(a.fecha);
    const fechaFormateada = isNaN(fecha)
      ? a.fecha
      : fecha.toLocaleDateString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return [i + 1, a.alumno, a.estado, fechaFormateada];
  });

  const csv = [encabezados, ...filas].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Asistencia_${nombreCurso.replace(/\s+/g,"_")}_Semana_${sesion}.csv`;
  link.click();
});

// --- Guardar cambios ---
document.getElementById("guardarCambios").addEventListener("click", async () => {
  if (!cambiosPendientes) return alert("No hay cambios para guardar.");

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify({ nombreCurso, sesion, asistencias }),
      headers: { "Content-Type": "application/json" }
    });

    const result = await response.json();
    if (result.success) {
      alert("✅ Cambios guardados correctamente.");
      cambiosPendientes = false;
      document.getElementById("guardarCambios").disabled = true;
    } else {
      alert("❌ Error al guardar los cambios: " + result.error);
    }
  } catch (error) {
    console.error(error);
    alert("❌ Error al guardar los cambios.");
  }
});

// --- Botón Volver ---
document.getElementById("volver").addEventListener("click", () => {
  window.location.href = "cursos.html";
});

// --- Cargar datos al iniciar ---
cargarAsistencia();

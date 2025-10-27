// --- Datos simulados (luego puedes reemplazar por conexión real) ---
const profesor = JSON.parse(localStorage.getItem('profesorLogeado')) || { nombre: "Profesor Invitado" };

// Ejemplo de cursos asignados
const cursos = [
  { id: 1, nombre: "Desarrollo Web I", alumnos: 25 },
  { id: 2, nombre: "Base de Datos", alumnos: 22 },
  { id: 3, nombre: "Programación JavaScript", alumnos: 28 }
];

document.getElementById("profesorNombre").textContent = `Profesor: ${profesor.nombre}`;
const cursosContainer = document.getElementById("cursosContainer");
const detalleCurso = document.getElementById("detalleCurso");
const tablaSesiones = document.getElementById("tablaSesiones").querySelector("tbody");

// --- Mostrar lista de cursos ---
cursos.forEach(curso => {
  const div = document.createElement("div");
  div.classList.add("curso-card");
  div.innerHTML = `
    <h3>${curso.nombre}</h3>
    <p><strong>Alumnos:</strong> ${curso.alumnos}</p>
    <button onclick="verCurso(${curso.id})">Ver semanas</button>
  `;
  cursosContainer.appendChild(div);
});

// --- Mostrar detalle de un curso ---
function verCurso(id) {
  const curso = cursos.find(c => c.id === id);
  if (!curso) return;

  document.getElementById("nombreCurso").textContent = curso.nombre;
  document.getElementById("totalAlumnos").textContent = curso.alumnos;

  cursosContainer.classList.add("oculto");
  detalleCurso.classList.remove("oculto");

  tablaSesiones.innerHTML = "";

  // Crear las 16 sesiones con fechas automáticas (una por semana)
  const hoy = new Date();
  for (let i = 1; i <= 16; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + (i - 1) * 7); // cada semana
    const fechaTexto = fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    // Verificamos si la asistencia ya fue registrada
    const key = `asistencia_${id}_${i}`;
    const asistenciaRegistrada = localStorage.getItem(key);

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>Semana ${i}</td>
      <td>${fechaTexto}</td>
      <td>
        <button onclick="registrarAsistencia(${id}, ${i})">
          ${asistenciaRegistrada ? "Ver asistencia" : "Registrar asistencia"}
        </button>
      </td>
    `;
    tablaSesiones.appendChild(fila);
  }
}

// --- Botón para volver a la lista ---
document.getElementById("btnVolver").addEventListener("click", () => {
  detalleCurso.classList.add("oculto");
  cursosContainer.classList.remove("oculto");
});

// --- Función para ir al registro de asistencia ---
function registrarAsistencia(cursoId, sesion) {
  const key = `asistencia_${cursoId}_${sesion}`;
  const asistenciaRegistrada = localStorage.getItem(key);

  localStorage.setItem(
    "cursoSeleccionado",
    JSON.stringify({ cursoId, sesion })
  );

  if (asistenciaRegistrada) {
    // Si ya fue registrada, ir a ver asistencia
    window.location.href = "verAsistencia.html";
  } else {
    // Si no, ir a registrar asistencia
    window.location.href = "registroAsistencia.html";
  }
}

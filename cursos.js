// --- Datos del profesor ---
const profesor = JSON.parse(localStorage.getItem('profesorLogeado')) || { nombre: "Profesor Invitado" };
document.getElementById("profesorNombre").textContent = `Profesor: ${profesor.nombre}`;

// --- Ejemplo de cursos asignados ---
const cursos = [
  { id: 1, nombre: "Desarrollo Web I", alumnos: 12 },
  { id: 2, nombre: "Base de Datos", alumnos: 12 },
  { id: 3, nombre: "Programación JavaScript", alumnos: 12 }
];

const cursosContainer = document.getElementById("cursosContainer");
const detalleCurso = document.getElementById("detalleCurso");
const tablaSesiones = document.getElementById("tablaSesiones").querySelector("tbody");

// --- Mostrar lista de cursos ---
cursos.forEach(curso => {
  const div = document.createElement("div");
  div.classList.add("curso-card");
  div.innerHTML = `
    <h3>${curso.nombre}</h3>
    <p><strong>Alumnos registrados:</strong> ${curso.alumnos}</p>
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

  // Crear las 16 semanas con fechas automáticas
  const hoy = new Date();
  for (let i = 1; i <= 16; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + (i - 1) * 7);
    const fechaTexto = fecha.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

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

// --- Volver a la lista de cursos ---
document.getElementById("btnVolver").addEventListener("click", () => {
  detalleCurso.classList.add("oculto");
  cursosContainer.classList.remove("oculto");
});

// --- Ir al registro o vista de asistencia ---
function registrarAsistencia(cursoId, sesion) {
  const key = `asistencia_${cursoId}_${sesion}`;
  const asistenciaRegistrada = localStorage.getItem(key);

  const curso = cursos.find(c => c.id === cursoId);

  // ✅ Se guarda correctamente el nombre del curso
  localStorage.setItem(
    "cursoSeleccionado",
    JSON.stringify({
      cursoId,
      sesion,
      cursoNombre: curso ? curso.nombre : "Curso sin nombre"
    })
  );

  // Redirige según si ya hay registro o no
  if (asistenciaRegistrada) {
    window.location.href = "verAsistencia.html";
  } else {
    window.location.href = "registroAsistencia.html";
  }
}

// --- Cerrar sesión ---
document.getElementById("btnCerrarSesion").addEventListener("click", () => {
  localStorage.removeItem('profesorLogeado');
  localStorage.removeItem('cursoSeleccionado');
  window.location.href = "login.html";
});

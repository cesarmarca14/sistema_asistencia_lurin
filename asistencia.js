const tabla = document.querySelector("#tablaAsistencia tbody");
const btnAgregar = document.getElementById("btnAgregar");
const btnExcel = document.getElementById("btnExcel");
let registros = [];

btnAgregar.addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value.trim();
  const codigo = document.getElementById("codigo").value.trim();
  const curso = document.getElementById("curso").value.trim();
  const carrera = document.getElementById("carrera").value.trim();
  const asistencia = document.getElementById("asistencia").value;
  const fecha = new Date().toLocaleDateString();

  if (!nombre || !codigo || !carrera) {
    alert("Por favor completa todos los campos");
    return;
  }

  const registro = { nombre, codigo,curso, carrera, asistencia, fecha };
  registros.push(registro);
  actualizarTabla();
  limpiarCampos();
});

function actualizarTabla() {
  tabla.innerHTML = "";
  registros.forEach((r, i) => {
    const fila = `
      <tr>
        <td>${i + 1}</td>
        <td>${r.nombre}</td>
        <td>${r.codigo}</td>
        <td>${r.curso}</td>
        <td>${r.carrera}</td>
        <td>${r.asistencia}</td>
        <td>${r.fecha}</td>
      </tr>`;
    tabla.innerHTML += fila;
  });
}

function limpiarCampos() {
  document.getElementById("nombre").value = "";
  document.getElementById("codigo").value = "";
  document.getElementById("curso").value = "";
  document.getElementById("carrera").value = "";
  document.getElementById("asistencia").value = "Presente";
}

btnExcel.addEventListener("click", () => {
  if (registros.length === 0) {
    alert("No hay registros para exportar");
    return;
  }
  const hoja = XLSX.utils.json_to_sheet(registros);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Asistencia");
  XLSX.writeFile(libro, "asistencia_instituto.xlsx");
});

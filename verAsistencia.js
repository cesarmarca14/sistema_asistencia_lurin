document.addEventListener("DOMContentLoaded", () => {

  // --- Recuperar datos del curso seleccionado ---
  const seleccion = JSON.parse(localStorage.getItem("cursoSeleccionado"));
  const curso = seleccion ? seleccion.cursoId : null;
  const sesion = seleccion ? seleccion.sesion : null;
  const cursoNombre = seleccion ? seleccion.cursoNombre : "Curso sin nombre";
  const sede = localStorage.getItem("sedeSeleccionada") || "No especificada";

  if (!curso || !sesion) {
    alert("No se encontró información del curso seleccionado.");
    window.location.href = "cursos.html";
    return;
  }

  // --- Mostrar título y detalles ---
  document.getElementById("tituloCurso").textContent = `Asistencia - ${cursoNombre}`;
  document.getElementById("infoSesion").textContent = `Semana ${sesion} – Sede: ${sede}`;

  // --- Recuperar registros guardados ---
  const data = JSON.parse(localStorage.getItem(`asistencia_${curso}_${sesion}`));
  const tbody = document.querySelector("#tablaAsistencia tbody");

  if (data && data.asistencia && data.asistencia.length > 0) {
    tbody.innerHTML = "";

    data.asistencia.forEach((item, index) => {
      const fila = document.createElement("tr");

      // --- Solo marcar rojo si está ausente ---
      let estiloEstado = "";
      if (item.estado.toLowerCase() === "ausente") {
        estiloEstado = "background-color: #ff4d4d; color: white; font-weight: bold;";
      }

      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.alumno}</td>
        <td style="${estiloEstado} text-align:center;">${item.estado}</td>
        <td>${data.fecha}</td>
      `;
      tbody.appendChild(fila);
    });

    document.getElementById("totalRegistros").textContent =
      `Total de registros: ${data.asistencia.length}`;
  } else {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888;">No hay registros de asistencia.</td></tr>`;
    document.getElementById("totalRegistros").textContent = "Total de registros: 0";
  }

  // --- Botón volver ---
  document.getElementById("volver").addEventListener("click", () => {
    window.location.href = "cursos.html";
  });

  // --- Botón descargar Excel con estilo ---
  document.getElementById("descargarExcel").addEventListener("click", () => {
    const tabla = document.getElementById("tablaAsistencia");
    const filas = tabla.querySelectorAll("tbody tr");

    if (!tabla || filas.length === 0) {
      alert("No hay registros para descargar.");
      return;
    }

    try {
      // Construir hoja con encabezado y tabla
      const datos = [
        ["Instituto Público Tecnológico de Lurín"],
        [`Curso: ${cursoNombre}`],
        [`Semana: ${sesion}`],
        [`Sede: ${sede}`],
        [""],
        ["N°", "Alumno", "Estado", "Fecha"]
      ];

      data.asistencia.forEach((item, i) => {
        datos.push([
          i + 1,
          item.alumno,
          item.estado,
          data.fecha
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(datos);

      // --- Ajustar tamaño de columnas ---
      ws["!cols"] = [
        { wch: 5 },   // N°
        { wch: 30 },  // Alumno
        { wch: 15 },  // Estado
        { wch: 15 }   // Fecha
      ];

      // --- Aplicar estilos (encabezado con color, bordes, etc.) ---
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;
          ws[cellRef].s = {
            font: { name: "Arial", sz: 11 },
            alignment: { vertical: "center", horizontal: "center" },
            border: {
              top: { style: "thin", color: { rgb: "CCCCCC" } },
              bottom: { style: "thin", color: { rgb: "CCCCCC" } },
              left: { style: "thin", color: { rgb: "CCCCCC" } },
              right: { style: "thin", color: { rgb: "CCCCCC" } }
            }
          };

          // Colores de encabezado
          if (R === 5) {
            ws[cellRef].s.fill = { fgColor: { rgb: "0070C0" } };
            ws[cellRef].s.font = { color: { rgb: "FFFFFF" }, bold: true };
          }
        }
      }

      // Crear libro y descargar
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Asistencia");

      const nombreArchivo = `Asistencia_${cursoNombre.replace(/\s+/g, "_")}_Semana${sesion}_Sede_${sede.replace(/\s+/g, "_")}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      alert("Ocurrió un error al intentar descargar el archivo Excel.");
    }
  });

});

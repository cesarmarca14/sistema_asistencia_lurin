<?php
include 'conexion.php';

if (isset($_POST['codigo'])) {
  $codigo = $_POST['codigo'];
  $fecha = date("Y-m-d");
  $hora = date("H:i:s");

  // Verifica si el alumno existe
  $check = mysqli_query($conn, "SELECT * FROM alumnos WHERE codigo='$codigo'");
  if (mysqli_num_rows($check) > 0) {
    $sql = "INSERT INTO registro_asistencia (codigo_alumno, fecha, hora) VALUES ('$codigo', '$fecha', '$hora')";
    if (mysqli_query($conn, $sql)) {
      echo "✅ Asistencia registrada correctamente.";
    } else {
      echo "❌ Error al registrar asistencia.";
    }
  } else {
    echo "⚠️ Alumno no encontrado.";
  }
}
?>

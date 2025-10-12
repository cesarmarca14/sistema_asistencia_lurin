<?php
include 'conexion.php';

$codigo = $_POST['codigo'];
$fecha = date("Y-m-d");
$hora = date("H:i:s");

$sql = "INSERT INTO registro_asistencia (codigo_alumno, fecha, hora) VALUES ('$codigo', '$fecha', '$hora')";
if (mysqli_query($conn, $sql)) {
  echo "✅ Asistencia registrada correctamente.";
} else {
  echo "❌ Error al registrar asistencia.";
}
?>

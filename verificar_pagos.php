<?php
header('Content-Type: application/json');

// Configuración de la base de datos
$servidor = "localhost";
$usuario = "root";
$contrasena = "";
$baseDeDatos = "gestion_cuentas";

try {
    // Conexión a la base de datos
    $conexion = new mysqli($servidor, $usuario, $contrasena, $baseDeDatos);
    
    if ($conexion->connect_error) {
        throw new Exception("Error de conexión: " . $conexion->connect_error);
    }

    // Configurar caracteres UTF-8
    $conexion->set_charset("utf8");

    // Obtener la fecha actual y fecha límite (7 días después)
    $fechaActual = date('Y-m-d');
    $fechaLimite = date('Y-m-d', strtotime('+7 days'));

    // Consulta para obtener pagos próximos con saldo pendiente
    $query = "SELECT 
                id,
                CONCAT(nombre, ' ', apellidos) as nombre_completo,
                fecha,
                monto_prestamo,
                total,
                saldo_restante
              FROM prestamos 
              WHERE fecha BETWEEN ? AND ?
              AND saldo_restante > 0
              ORDER BY fecha ASC";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param("ss", $fechaActual, $fechaLimite);
    $stmt->execute();
    
    $resultado = $stmt->get_result();
    $pagosProximos = [];

    while ($fila = $resultado->fetch_assoc()) {
        $pagosProximos[] = [
            'id' => $fila['id'],
            'nombre_completo' => $fila['nombre_completo'],
            'fecha' => $fila['fecha'],
            'monto_prestamo' => $fila['monto_prestamo'],
            'total' => $fila['total'],
            'saldo_restante' => $fila['saldo_restante']
        ];
    }

    $stmt->close();
    $conexion->close();

    // Devolver los resultados
    echo json_encode([
        'exito' => true,
        'datos' => $pagosProximos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => $e->getMessage()
    ]);
}
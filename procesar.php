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

    // Obtener datos del formulario
    $nombre = $conexion->real_escape_string($_POST['nombre']);
    $apellidos = $conexion->real_escape_string($_POST['apellidos']);
    $fecha = $conexion->real_escape_string($_POST['fecha']);
    $montoPrestamo = floatval($_POST['montoPrestamo']);
    $interes = $montoPrestamo * 0.20; // Cálculo del 20% de interés
    $total = $montoPrestamo + $interes;
    $observaciones = $conexion->real_escape_string($_POST['observaciones']);
    $abonoInteres = floatval($_POST['abonoInteres']);
    $abonoCapital = floatval($_POST['abonoCapital']);
    $saldoRestante = $total - $abonoInteres - $abonoCapital;

    // Preparar la consulta SQL
    $query = "INSERT INTO prestamos (
        nombre, 
        apellidos, 
        fecha, 
        monto_prestamo, 
        interes,
        total,
        observaciones,
        abono_interes,
        abono_capital,
        saldo_restante
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($query);
    $stmt->bind_param(
        "sssdddsddd",
        $nombre,
        $apellidos,
        $fecha,
        $montoPrestamo,
        $interes,
        $total,
        $observaciones,
        $abonoInteres,
        $abonoCapital,
        $saldoRestante
    );

    if ($stmt->execute()) {
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Registro guardado exitosamente',
            'id' => $conexion->insert_id
        ]);
    } else {
        throw new Exception("Error al guardar el registro: " . $stmt->error);
    }

    $stmt->close();
    $conexion->close();

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'exito' => false,
        'mensaje' => $e->getMessage()
    ]);
}
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cuentasForm');
    const montoPrestamo = document.getElementById('montoPrestamo');
    const interes = document.getElementById('interes');
    const total = document.getElementById('total');
    const abonoInteres = document.getElementById('abonoInteres');
    const abonoCapital = document.getElementById('abonoCapital');
    const saldoRestante = document.getElementById('saldoRestante');

    // Función para calcular el interés (20% del monto prestado)
    function calcularInteres() {
        const montoValue = parseFloat(montoPrestamo.value) || 0;
        const interesValue = montoValue * 0.20;
        interes.value = interesValue.toFixed(2);
        calcularTotal();
    }

    // Función para calcular el total (monto + interés)
    function calcularTotal() {
        const montoValue = parseFloat(montoPrestamo.value) || 0;
        const interesValue = parseFloat(interes.value) || 0;
        const totalValue = montoValue + interesValue;
        total.value = totalValue.toFixed(2);
        calcularSaldoRestante();
    }

    // Función para calcular el saldo restante
    function calcularSaldoRestante() {
        const totalValue = parseFloat(total.value) || 0;
        const abonoInteresValue = parseFloat(abonoInteres.value) || 0;
        const abonoCapitalValue = parseFloat(abonoCapital.value) || 0;
        const saldoValue = totalValue - abonoInteresValue - abonoCapitalValue;
        saldoRestante.value = saldoValue.toFixed(2);
    }

    // Event listeners para los campos que afectan los cálculos
    montoPrestamo.addEventListener('input', calcularInteres);
    abonoInteres.addEventListener('input', calcularSaldoRestante);
    abonoCapital.addEventListener('input', calcularSaldoRestante);

    // Manejar envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        try {
            // Mostrar notificación de procesamiento
            mostrarNotificacion('Procesando solicitud...', 'info');
            
            const response = await fetch('procesar.php', {
                method: 'POST',
                body: formData
            });
            
            // Verificar respuesta JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('La respuesta del servidor no es JSON válido');
            }
            
            const data = await response.json();
            
            if (data.exito) {
                mostrarNotificacion('Registro guardado exitosamente', 'success');
                form.reset();
                cargarRegistros();
            } else {
                mostrarNotificacion(`Error: ${data.mensaje}`, 'error');
                console.error('Error del servidor:', data);
            }
        } catch (error) {
            console.error('Error completo:', error);
            mostrarNotificacion(`Error al procesar la solicitud: ${error.message}`, 'error');
        }
    });

    // Función para mostrar notificaciones
    function mostrarNotificacion(mensaje, tipo) {
        const colores = {
            success: '#4caf50',
            error: '#f44336',
            info: '#2196F3'
        };
        
        Toastify({
            text: mensaje,
            duration: 4000,
            gravity: "top",
            position: 'right',
            style: {
                background: colores[tipo] || '#333'
            },
            onClick: function(){}
        }).showToast();
    }

    // Función para cargar registros existentes
    async function cargarRegistros() {
        try {
            const response = await fetch('obtener_registros.php');
            if (!response.ok) {
                throw new Error(`¡Error HTTP! estado: ${response.status}`);
            }
            const data = await response.json();
            
            const tbody = document.getElementById('registrosBody');
            tbody.innerHTML = '';
            
            data.forEach(registro => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${registro.nombre} ${registro.apellidos}</td>
                    <td>${registro.fecha}</td>
                    <td>${parseFloat(registro.monto_prestamo).toFixed(2)}</td>
                    <td>${parseFloat(registro.total).toFixed(2)}</td>
                    <td>${parseFloat(registro.saldo_restante).toFixed(2)}</td>
                    <td>
                        <button class="accion-btn editar-btn" data-id="${registro.id}">Editar</button>
                        <button class="accion-btn eliminar-btn" data-id="${registro.id}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al cargar registros:', error);
            mostrarNotificacion('Error al cargar los registros: ' + error.message, 'error');
        }
    }

    // Función para verificar próximos pagos
    async function verificarProximosPagos() {
        try {
            const response = await fetch('verificar_pagos.php');
            const data = await response.json();
            
            const contenedorAlertas = document.getElementById('alertasProximosPagos');
            contenedorAlertas.innerHTML = '';
            
            if (data.exito && data.datos.length > 0) {
                data.datos.forEach(pago => {
                    const alerta = document.createElement('div');
                    alerta.className = 'alerta';
                    alerta.innerHTML = `
                        Próximo pago: ${pago.nombres_apellidos}
                        Fecha: ${pago.fecha_pago}
                        Monto: $${parseFloat(pago.total_deuda).toFixed(2)}
                    `;
                    contenedorAlertas.appendChild(alerta);
                });
            }
        } catch (error) {
            console.error('Error al verificar pagos:', error);
            mostrarNotificacion('Error al verificar próximos pagos', 'error');
        }
    }

    // Inicializar la página
    cargarRegistros();
    verificarProximosPagos();
    setInterval(verificarProximosPagos, 3600000); // Verificar cada hora
});
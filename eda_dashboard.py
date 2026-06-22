import pandas as pd
import json
import random
from datetime import datetime, timedelta

OUTPUT_JSON = "dashboard_data.json"

def generate_mock_data(num_records=100):
    nombres = ["Juan", "María", "Carlos", "Ana", "Luis", "Elena", "Pedro", "Laura", "Jorge", "Lucía"]
    apellidos = ["García", "Rodríguez", "Martínez", "López", "González", "Pérez", "Sánchez", "Ramírez", "Torres", "Flores"]
    
    data = []
    
    start_date = datetime.now() - timedelta(days=365) # Último año
    
    for i in range(1, num_records + 1):
        nombre_completo = f"{random.choice(nombres)} {random.choice(apellidos)}"
        fecha = start_date + timedelta(days=random.randint(0, 365))
        monto_prestamo = round(random.uniform(500000, 5000000), 2)
        interes = round(monto_prestamo * 0.20, 2)
        total = round(monto_prestamo + interes, 2)
        
        # Simular algunos pagos
        porcentaje_pagado = random.uniform(0, 1)
        abono_interes = round(interes * porcentaje_pagado, 2)
        abono_capital = round(monto_prestamo * porcentaje_pagado, 2)
        saldo_restante = round(total - (abono_interes + abono_capital), 2)
        
        data.append({
            "id": i,
            "nombre_completo": nombre_completo,
            "fecha": fecha.strftime('%Y-%m-%d'),
            "monto_prestamo": monto_prestamo,
            "interes": interes,
            "total": total,
            "abono_interes": abono_interes,
            "abono_capital": abono_capital,
            "saldo_restante": saldo_restante
        })
        
    return pd.DataFrame(data)

def process_data():
    print("Generando datos simulados...")
    df = generate_mock_data(100)
    
    df['fecha'] = pd.to_datetime(df['fecha'])
    
    # 1. KPIs principales
    total_prestamos = df['monto_prestamo'].sum()
    total_intereses = df['interes'].sum()
    saldo_restante_total = df['saldo_restante'].sum()
    cantidad_prestamos = len(df)
    
    kpis = {
        "total_prestado": float(total_prestamos),
        "total_intereses": float(total_intereses),
        "saldo_restante": float(saldo_restante_total),
        "cantidad": cantidad_prestamos
    }
    
    # 2. Evolución temporal de préstamos (mensual)
    df['mes_anio'] = df['fecha'].dt.to_period('M').astype(str)
    evolucion_temporal = df.groupby('mes_anio')['monto_prestamo'].sum().reset_index().sort_values('mes_anio')
    temporal_labels = evolucion_temporal['mes_anio'].tolist()
    temporal_valores = evolucion_temporal['monto_prestamo'].tolist()
    
    # 3. Estado de pagos globales (Capital e Interés Pagado vs Restante)
    abono_cap_total = df['abono_capital'].sum()
    abono_int_total = df['abono_interes'].sum()
    
    grafico_estado_pagos = {
        "labels": ["Abono Capital", "Abono Interés", "Saldo Restante"],
        "valores": [float(abono_cap_total), float(abono_int_total), float(saldo_restante_total)]
    }
    
    # 4. Top 5 préstamos más altos
    top_prestamos = df.nlargest(5, 'monto_prestamo')[['nombre_completo', 'monto_prestamo', 'fecha']]
    top_prestamos['fecha'] = top_prestamos['fecha'].dt.strftime('%Y-%m-%d')
    top_prestamos_lista = top_prestamos.to_dict(orient='records')
    
    # Construir el diccionario final JSON
    dashboard_data = {
        "kpis": kpis,
        "grafico_temporal": {
            "labels": temporal_labels,
            "valores": temporal_valores
        },
        "grafico_estado_pagos": grafico_estado_pagos,
        "top_prestamos": top_prestamos_lista
    }
    
    # Guardar a JSON
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(dashboard_data, f, ensure_ascii=False, indent=4)
        
    print(f"Datos generados y exportados exitosamente a {OUTPUT_JSON}")

if __name__ == "__main__":
    process_data()

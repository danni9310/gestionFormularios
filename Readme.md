## Módulo para la gestión de información de formularios

## Documentacion en: /docs

# POST /consultas/api/v1/gestion/formularios/variables/visualizacion/grupos

Endpoint para traer el último formulario de todos los pacientes en un rango de fechas y agruparlos por una variable específica

{
"fechaInicial": 1568402369757,
"fechaFinal": 1568782800000,
"consulta": [{

    		"coleccion":"formularios_resumen",
    		"documento": "signos_vitales",
    		"variables": ["documento", "key", "variable1", "variable8"]
    	}
    ],
    "grupo": "variable8"

}

# POST /consultas/api/v1/gestion/formularios/variables/visualizacion

Endpoint para traer descargar el último formulario de todos los pacientes en un rango de fechas con las variables de interes

{
"fechaInicial": 1568402369757,
"fechaFinal": 1568782800000,
"consulta": [{

    		"coleccion":"formularios_resumen",
    		"documento": "signos_vitales",
    		"variables": ["documento", "key", "variable1", "variable8"]
    	}
    ]

}

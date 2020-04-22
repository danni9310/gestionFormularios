const read = require("../../models/firestore/read");
const { buildResponse, stringRaw } = require("../../config/utils");
const descargas = require("./descargas");

const getEsquema = async (coleccion, formulario) => {
  const condiciones = [
    {
      campo: "key",
      condicion: "==",
      valor: formulario
    }
  ];
  return await read.readDocWhere(coleccion, condiciones);
};

const getDocumentosCompletos = async (
  coleccion,
  documento,
  fechaInicial,
  fechaFinal
) => {
  const condiciones = [
    {
      campo: "key",
      condicion: "==",
      valor: documento
    },
    {
      campo: "fecha_creacion",
      condicion: ">=",
      valor: fechaInicial
    },
    {
      campo: "fecha_creacion",
      condicion: "<=",
      valor: fechaFinal
    }
  ];
  return await read.readDocWhere(coleccion, condiciones);
};

module.exports.visualizarRespuestas = async (res, parameters) => {
  try {
    const response = await getDocumentosCompletos(
      parameters.consulta[0].coleccion,
      parameters.consulta[0].documento,
      parameters.fechaInicial,
      parameters.fechaFinal
    );
    buildResponse(res, 200, response, "Consulta de formularios realizada");
  } catch (error) {
    console.log(error);
    buildResponse(res, 400, "No funciona", "Error encontrando el formulario");
  }
};

const getDocumentos = async (
  coleccion,
  documento,
  fechaInicial,
  fechaFinal,
  variables
) => {
  const condiciones = [
    {
      campo: "key",
      condicion: "==",
      valor: documento
    },
    {
      campo: "fecha_creacion",
      condicion: ">=",
      valor: fechaInicial
    },
    {
      campo: "fecha_creacion",
      condicion: "<=",
      valor: fechaFinal
    }
  ];
  return await read.readVariables(coleccion, condiciones, variables);
};

const getKeys = (esquema, variables) => {
  const obj = {};
  variables.forEach(keys => {
    const nombre = Object.keys(esquema.variable).filter(
      element => esquema.variable[element].variable === keys
    );
    if (nombre.length !== 0) {
      obj[esquema.variable[nombre].key] = esquema.variable[nombre].tipo;
    } else {
      obj[keys] = "";
    }
  });
  return obj;
};

const getHeader = (esquema, variables) => {
  const header = [];
  Object.keys(variables).forEach(keys => {
    const nombre = Object.keys(esquema.variable).filter(
      element => esquema.variable[element].key === keys
    );
    if (nombre.length !== 0) {
      header.push({
        text: esquema.variable[nombre].nombre,
        value: esquema.variable[nombre].key
      });
    } else {
      header.push({
        text: keys,
        value: keys
      });
    }
  });
  return header;
};

/**
 * Permite obtener los valores unicos desntro de un json para una key
 * @param {json} data datos para agrupar
 * @param {string} tipoGrupo key de la que se quiere obtener valores unicos
 */
const getUniqueValue = (data, tipoGrupo) => {
  const items = data.map(element => {
    return element[tipoGrupo];
  });
  const uniqueItems = [...new Set(items)];
  return uniqueItems;
};

const getUltimoDocumento = (data, uniqueItems, variableConsulta) => {
  const ultimoDocumento = [];
  uniqueItems.forEach(element => {
    const formularios = data.filter(
      orden => orden[variableConsulta] === element
    );
    const descendente = formularios.sort((a, b) => {
      return b.fecha_creacion - a.fecha_creacion;
    });
    ultimoDocumento.push(descendente[0]);
  });
  return ultimoDocumento;
};

/**
 * Funcion para agrupar un conjunto de datos apartir de un array de datos unicos,
 * la variableConsulta debe ser la misma variable de la que se construye el array
 * @param {json} data
 * @param {array} uniqueItems Array de valores unicos para agrupar
 * @param {string} variableConsulta Variable de interes para agrupar
 */
const getGrupos = (data, uniqueItems, variableConsulta) => {
  const grupos = [];
  uniqueItems.forEach(element => {
    grupos.push(data.filter(orden => orden[variableConsulta] === element));
  });
  return grupos;
};

const convertiJsonGrafica = (datos, variableGrupo, headers) => {
  const series = [];
  const ejeXGeneral = [];
  const usuarios = [];
  datos.forEach(element => {
    series.push(element.length);
    ejeXGeneral.push(element[0][variableGrupo]);
    usuarios.push(element);
  });
  const ejexNull = Array.from(ejeXGeneral, item => (item === null ? "" : item));
  const ejex = Array.from(ejexNull, item => (item === undefined ? "" : item));
  return { series, ejex, usuarios, headers };
};

module.exports.visualizarRespuestasVariables = async (res, parameters) => {
  try {
    const consulta = [];
    for (let i = 0; i < parameters.consulta.length; i += 1) {
      const datosDescarga = {};
      const esquema = await getEsquema(
        `${stringRaw(parameters.consulta[i].coleccion)}_esquemas`,
        parameters.consulta[i].key
      );
      const keys = getKeys(esquema[0], [
        ...parameters.consulta[i].variables,
        "cedula"
      ]);
      const datos = await getDocumentos(
        `${stringRaw(parameters.consulta[i].coleccion)}_resumen`,
        parameters.consulta[i].key,
        parameters.fechaInicial,
        parameters.fechaFinal,
        keys
      );
      const documentosUnicos = getUniqueValue(datos, "cedula");
      const ultimosDocumentos = getUltimoDocumento(
        datos,
        documentosUnicos,
        "cedula"
      );
      datosDescarga.headers = getHeader(esquema[0], keys);
      datosDescarga.data = ultimosDocumentos;
      consulta.push(datosDescarga);
    }
    const response = await descargas.loadExcelStorage(consulta[0]);
    buildResponse(res, 200, response, "Consulta de formularios realizada");
  } catch (error) {
    console.log(error);
    buildResponse(res, 400, error, "Error encontrando el formulario");
  }
};

module.exports.visualizarRespuestasVariablesGrupos = async (
  res,
  parameters
) => {
  try {
    const consulta = [];
    for (let i = 0; i < parameters.consulta.length; i += 1) {
      const esquema = await getEsquema(
        `${stringRaw(parameters.consulta[i].coleccion)}_esquemas`,
        parameters.consulta[i].key
      );
      const keys = getKeys(esquema[0], [
        ...parameters.consulta[i].variables,
        "cedula"
      ]);
      const variableGrupo = Object.keys(
        getKeys(esquema[0], [parameters.grupo])
      )[0];
      const datos = await getDocumentos(
        `${stringRaw(parameters.consulta[i].coleccion)}_resumen`,
        parameters.consulta[i].key,
        parameters.fechaInicial,
        parameters.fechaFinal,
        keys
      );
      const documentosUnicos = getUniqueValue(datos, "cedula");
      const ultimosDocumentos = getUltimoDocumento(
        datos,
        documentosUnicos,
        "cedula"
      );
      const clasificacion = getUniqueValue(ultimosDocumentos, variableGrupo);
      const grupos = getGrupos(ultimosDocumentos, clasificacion, variableGrupo);
      const dataGrafica = convertiJsonGrafica(
        grupos,
        variableGrupo,
        getHeader(esquema[0], keys)
      );
      consulta.push(dataGrafica);
    }

    buildResponse(res, 200, consulta[0], "Consulta de formularios realizada");
  } catch (error) {
    console.log(error);
    buildResponse(res, 400, error, "Error encontrando el formulario");
  }
};

module.exports.getCollectionAvailable = res => {
  const consulta = [
    {
      nombre: "Formularios",
      coleccion: "formularios"
    }
  ];
  buildResponse(res, 200, consulta, "Colecciones disponibles");
};

const dynamicSort = property => {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a, b) => {
    if (sortOrder === -1) {
      return b[property].localeCompare(a[property]);
    }
    return a[property].localeCompare(b[property]);
  };
};

const getAllDocumentos = async collection => {
  return await read.readCollection(collection);
};

const getDocumentsName = documents => {
  const res = [];
  documents.forEach(element => {
    res.push({
      nombre: element.nombre,
      key: element.key,
      iconoUrl: element.iconoUrl
    });
  });
  return res;
};

module.exports.getDocumentsCollection = async (res, parameters) => {
  try {
    const documents = await getAllDocumentos(
      `${stringRaw(parameters)}_esquemas`
    );
    const consulta = getDocumentsName(documents);
    const order = consulta.sort(dynamicSort("nombre"));
    buildResponse(res, 200, order, "Consulta de documentos de una colección");
  } catch (error) {
    console.log(error);
    buildResponse(
      res,
      400,
      error,
      "Error encontrando documentos de una colección"
    );
  }
};

const getDocumentScheme = async (colletion, document) => {
  const condiciones = [
    {
      campo: "key",
      condicion: "==",
      valor: document
    }
  ];
  return await read.readDocWhere(colletion, condiciones);
};

const getVariables = scheme => {
  const res = [];
  // Object.keys(scheme).forEach(element => {
  //   if (element !== "variable" && element !== "conversacion" ) {
  //     res.push({ nombre: element, valor: element });
  //   }
  // });

  Object.keys(scheme).forEach(element => {
    if (element === "cedula") {
      res.push({ nombre: element, valor: element });
    }
  });

  Object.keys(scheme.variable).forEach(element => {
    res.push({
      nombre: scheme.variable[element].nombre,
      valor: scheme.variable[element].variable
    });
  });
  return res;
};

module.exports.getVariablesDocuments = async (res, collection, key) => {
  try {
    const documents = await getDocumentScheme(
      `${stringRaw(collection)}_esquemas`,
      key
    );
    const consulta = getVariables(documents[0]);
    const order = consulta.sort(dynamicSort("nombre"));
    buildResponse(res, 200, order, "Consulta de las variables de un esquema");
  } catch (error) {
    console.log(error);
    buildResponse(
      res,
      400,
      error,
      "Error encontrando las variables de un esquema"
    );
  }
};

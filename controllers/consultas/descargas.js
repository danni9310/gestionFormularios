const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const read = require("../../models/firestore/read");
const { buildResponse } = require("../../config/utils");
const { bucket } = require("../../services/storage");

const configHeader = header => {
  const headerCsv = [];
  header.forEach(element => {
    headerCsv.push({
      id: element.value,
      title: element.text
    });
  });
  return headerCsv;
};

const downloadExcel = async fileName => {
  let fecha = new Date();
  fecha = fecha.setDate(fecha.getDate() + 1);
  fecha = new Date(+fecha);
  const mes = fecha.getMonth() + 1;
  const expires = `${mes.toString()}-${fecha
    .getDate()
    .toString()}-${fecha.getFullYear().toString()}`;

  const file = bucket.file(fileName);
  const existe = await file.exists().then(data => {
    const exists = data[0];
    return exists;
  });

  if (existe) {
    return await file
      .getSignedUrl({
        expires,
        action: "read"
      })
      .then(signedUrls => {
        return signedUrls[0];
      })
      .catch(err => {
        console.log("err", err);
      });
  }
  return false;
};

/**
 * Funcion para descargar en excel los datos de un json, primero se convierten los datos en .csv,
 * se sube al storage y finalmente se genera el link de descarga.
 * @param {json} parameters
 */
const loadExcelStorage = async parameters => {
  const header = configHeader(parameters.headers);
  const localFilePath = path.join(__dirname, "../../files/data.csv");
  const csvWriter = createCsvWriter({
    path: localFilePath,
    header
  });

  try {
    await csvWriter
      .writeRecords(parameters.data)
      .then(() => console.log("The CSV file was written successfully"));
    const res = await bucket.upload(localFilePath);
    const url = await downloadExcel(res[0].name);
    return url;
  } catch (error) {
    console.log(error);
    return "Error al guardar archivo";
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

module.exports.getVariables = async (res, parameters) => {
  try {
    const consulta = [];

    for (let i = 0; i < parameters.consulta.length; i += 1) {
      const datosDescarga = {};
      const datos = await getDocumentos(
        parameters.consulta[i].coleccion,
        parameters.consulta[i].documento,
        parameters.fechaInicial,
        parameters.fechaFinal,
        parameters.consulta[i].variables
      );
      datosDescarga.headers = parameters.consulta[i].variables;
      datosDescarga.data = datos;
      consulta.push(datosDescarga);
    }
    const response = await loadExcelStorage(consulta[0]);
    buildResponse(res, 200, response, "Consulta de variables realizado");
  } catch (error) {
    console.log(error);
    buildResponse(res, 400, "Error encontrando variables");
  }
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

/**
 * Endpoint para descargar todas las respuestas de un formulario
 */
module.exports.getFormulariosCompletos = async (res, parameters) => {
  try {
    const consulta = [];
    for (let i = 0; i < parameters.consulta.length; i += 1) {
      const datosDescarga = {};
      const datos = await getDocumentosCompletos(
        parameters.consulta[i].coleccion,
        parameters.consulta[i].documento,
        parameters.fechaInicial,
        parameters.fechaFinal
      );
      const variables = Object.keys(datos[0]);
      datosDescarga.headers = variables;
      datosDescarga.data = datos;
      consulta.push(datosDescarga);
    }
    const response = await loadExcelStorage(consulta[0]);
    buildResponse(res, 200, response, "Consulta de formularios realizada");
  } catch (error) {
    console.log(error);
    buildResponse(res, 400, error, "Error encontrando el formulario");
  }
};

module.exports = {
  loadExcelStorage
};

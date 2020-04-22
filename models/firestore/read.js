const moment = require("moment");
const admin = require("../../services/firebase");
const { construirWhere, MyError } = require("./utils");

const dbFirestore = admin.firestore();

const readVariables = async (coleccion, condiciones, variables) => {
  const dataRef = dbFirestore.collection(coleccion);
  try {
    const query = construirWhere(dataRef, condiciones);
    const snapshot = await query.get();
    const docs = [];

    snapshot.forEach(doc => {
      const data = {};
      const orden = doc.data();
      Object.keys(variables).forEach(element => {
        if (variables[element] === "fecha") {
          data[element] = moment(orden[element]).format("YYYY/MM/DD");
        } else if (element === "fecha_creacion") {
          data[element] = moment(orden[element]).format("YYYY/MM/DD");
        // } else if (variables[element] === "string") {
        //   if (orden[element] !== null && orden[element] !== undefined) data[element] = orden[element].trim();
        //   else data[element] = orden[element];
        } else {
          data[element] = orden[element];
        }
      });
      docs.push(data);
    });
    return docs;
  } catch (error) {
    console.log(error);
    return MyError({ message: "No se ha podido leer los datos", status: 400 });
  }
};

const readDocWhere = async (coleccion, condiciones) => {
  const dataRef = dbFirestore.collection(coleccion);
  try {
    const query = construirWhere(dataRef, condiciones);
    const snapshot = await query.get();
    const docs = [];
    snapshot.forEach(doc => {
      docs.push(doc.data());
    });
    return docs;
  } catch (error) {
    console.log(error);
    return "Error leyendo documentos";
  }
};

const readCollection = async coleccion => {
  const dataRef = dbFirestore.collection(coleccion);
  try {
    const snapshot = await dataRef.get();
    const docs = [];
    snapshot.forEach(doc => {
      docs.push(doc.data());
    });
    return docs;
  } catch (error) {
    console.log(error);
    return MyError({ message: "No se ha podido leer los datos", status: 400 });
  }
};

module.exports = {
  readVariables,
  readDocWhere,
  readCollection
};

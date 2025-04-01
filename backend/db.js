const { stripTypeScriptTypes } = require('module');
const {MongoClient} = require('mongodb');
const { setDefaultHighWaterMark } = require('stream');
let db;


async function initDataBase(){
    let url = "mongodb://localhost:27017/";
    let client = new MongoClient(url);

    try{
        await client.connect();
        db = client.db('local');
        console.log("Conexion con la base de datos exitosa");
    }
    catch(err){
        return console.log("Ocurrio un error: ", err);
    }
}

async function insert(data){
    try{
        await db.collection('tareas').insertOne({data});
    }
    catch(err){
        console.log("Ocurrio un error con la base de datos", err);
    }
}

async function delet(data){
    try{
        let delElement = await db.collection('tareas').find({ "data.name": data.name, "data.date": data.date }).toArray();

        if(delElement.length === 0){
            return false;
        }
        console.log(delElement[0].data.date);
        
       await db.collection('tareas').deleteOne({"data.name": delElement[0].data.name, "data.date": delElement[0].data.date});
    }
    catch(err){
        console.log("Ocurrio un error en la db", err);
    }
}

async function show(){
    try{
        let items = await db.collection('tareas').find().toArray();

        if(items.length === 0) return ;

        return items;
    }
    catch(err){
        console.log("Ocurrio un error: ",err);
    }
}

async function update(data) {
    try {
        console.log("Datos recibidos:", data);

        let updateElement = await db.collection('tareas').findOne({"data.name": data.name});

        if (!updateElement) {
            console.log("No se encontró ningún elemento con el nombre dado.");
            return;
        }

        const result = await db.collection('tareas').updateOne(
            {"data.name": updateElement.data.name},
            {$set: {"data.date": data.newDate}}
        );

        if (result.modifiedCount === 0) {
            console.log("No se realizaron modificaciones. Verifica el filtro y los valores.");
        } else {
            console.log("Elemento actualizado correctamente.");
        }
    }
    catch(err) {
        console.log("Ocurrió un error:", err);
    }
}


module.exports = {initDataBase, insert, delet, show, update};
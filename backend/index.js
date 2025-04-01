const express = require('express');
const cors = require('cors');
const {insert, initDataBase, delet, show, update} = require('./db');
const { measureMemory } = require('vm');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

initDataBase();

app.route('/tareas')
    .get(async (req, res) =>{
        try {
            let answer = await show();

            if (!answer || answer.length === 0){
                return res.status(404).json({ message: "No se encontraron tareas" });
            }

            return res.status(200).json(answer);
        } 
        catch(err){
            console.error("Ocurrio un error: ", err);
            return res.status(500).send({ message: "Ocurrio un error" });
        }
    })

    .post((req,res) =>{
        let data = req.body;
        
        try{
            insert(data);
            res.status(201).json({message:"\u2705"});
        }
        catch(err){
            res.status(500).json({message: "Ocurrio un error"});
        }
    })

    .put((req,res) =>{
        try{
            let data = req.body;
            update(data);
            res.status(204).send({message: "\u2705"});
        }
        catch(err){
            res.status(500).send({message: "Ocurrio un error"});
        }

    })

    .delete((req,res) =>{
        let data = req.body;

        try{
           if(delet(data) === false) return res.status(404).send({message:"No se contro la tarea"});
            res.status(204).send({message: "\u2705"});
        }
        catch(err){
            res.status(500).send({message: "Ocurrio un error en el sevidor"});
        }

    });


app.listen(port, () =>{
    console.log(`http://localhost:${port}`);
})

const router = require('express').Router()
const Exercise = require('../models/Exercises')



// Creat - Criação de dados
router.post('/', async (req, res)=>{
    // Req Body
    const {
        name,
        description,
        image,
        video,
        category,
        summary,
    } = req.body

    const exercise = {
        name,
        description,
        image,
        video,
        category,
        summary,
    }

    if(!name){
        res.status(422).json({
            message: "O exercicio precisa de nome"
        })
    }

     try{

            await Exercise.create(exercise)

            res.status(201).json({
                message: "Exercicio cadastrado com sucesso"
            })

        
    }catch(error){
        res.status(500).json({error: error})
    }
})


// Read - Leitura de dados

router.get('/', async (req, res)=> {
    try{
        const exercises = await Exercise.find()
        res.status(200).json(exercises)
    }catch (error){
        res.status(500).json({error: error})
    }
})

module.exports = router 
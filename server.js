const express = require('express')
const app = express()
const celebritees = require('./celebrites.json')
const db = require('./database.js')
const cors = require('cors')
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
//middleware
app.use(express.json())
app.use(cors())

app.get('/users', async (req,res)=>{
    try{
        let conn = await db.getConnection()
        const rows = await conn.query('SELECT * FROM utilisateur')
        res.status(200).json(rows)
    }
    catch(err){
        console.log(err)

    }
})

app.put('/addUser',(req,res)=>{
    try{
        rl.question('Entrez votre Nom :',(nom)=>{
            rl.question('Entrez votre Prénom :',(prenom)=>{
                rl.question('Entrez votre email', async(email)=>{
                    let conn = await db.getConnection()
                    const query = await conn.query("INSERT INTO utilisateur (nom, prenom, email)VALUES('"+nom+"','"+prenom+"','"+email+"')")
                    rl.close()
                    res.status(200)
                })
            })
        })
    }
    catch(err){
        console.log(err)
    }
})
app.delete('/deleteUser/:id', async(req,res)=>{
    let userId =  req.params.id
    let conn = await db.getConnection()
    const rows = await conn.query('SELECT * FROM utilisateur')
    rows.forEach( async element => {
        if(element.id_user==userId){
            const query = await conn.query('DELETE FROM utilisateur WHERE utilisateur.id_user='+userId)
            res.status(200)
        }
    });
})

app.put('/updateUser/:id', async(req,res)=>{
    let userId =  req.params.id
    let conn = await db.getConnection()
    const rows = await conn.query('SELECT * FROM utilisateur')
    rows.forEach( async element=>{
        if(element.id_user==userId){
            let champs
            rl.question('Champ à modifier?', (choix)=>{
                switch(choix.toLowerCase()){
                    case 'nom':
                        champs='nom'
                        break;
                    case 'prenom':
                        champs='prenom'
                        break;
                    case 'email':
                        champs='email'
                        break;
                }
                rl.question('Rentrer la nouvelle valeur',async (choix)=>{
                    const query = await conn.query("UPDATE utilisateur SET "+champs+"='"+choix+"' WHERE id_user="+userId)
                    res.status(200)
                })
            })
        }
    })
})


app.get('/getMsg/:id',async (req,res)=>{
    let userId=req.params.id
    let conn = await db.getConnection()
    const rows = await conn.query('SELECT * FROM commentaire WHERE id_user'+userId)
    res.status(200).json(rows)
})

app.put('/setMsg',async(req,res)=>{
    rl.question('Entrez votre commentaire: ', async(comm)=>{
        let conn = await db.getConnection()

        const query = await conn.query("INSERT INTO commentaire (commentaire, date_creation, id_techno, id_user)VALUES('"+comm+"','"+new Date().toJSON().slice(0, 10)+"','1','1')")
        rl.close()
        res.status(200)
    })

})

app.get('/getAllMsg/:id'),async(req,res)=>{
    let technoId=req.params.id
    let conn = await db.getConnection()
    const rows = await conn.query('SELECT * FROM commentaire WHERE id_techno'+technoId)
    res.status(200).json(rows)
}

app.get('/getMsgBefore/:date',async(req,res)=>{
    let date=req.params.date
    let conn = await db.getConnection()
    const rows = await conn.query("SELECT * FROM commentaire WHERE date_creation <'"+date+"'")
    res.status(200).json(rows)

})
app
app.listen(8000,()=>{console.log("Serveur à l'écoute")}) 
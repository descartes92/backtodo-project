// Déclarations des dépendances

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    app = express(),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// Initialisation de la connexion a la base de données
mongoose.connect('mongodb://localhost/todoList', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });



// Récuperation des models
let User = require('./models/user');
let List = require('./models/list');
let Task = require('./models/task');



// MIDDLEWARE => ROUTE


// Déclarations des routes de notre application
app.route('/').get(function (req, res) {
    res.send('Bienvenue sur le serveur du site  !');

});


//ME PERMET DE LIRE L'ENSEMBLE DE MES UTILISATEURS
app.route('/users').get(function (req, res) {
    User.find(function (err, user) {
        if (err) {
            res.status(400).send(err);
        } else
            res.status(201).send(user)
    })
})


// PERMET D'ENREGISTRER UN UTILISATEUR => REGISTER
app.route('/register').post(function (req, res) {
    bcrypt.hash(req.body.password, 10, function (err, hash) {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        })

        user.save(function (err, data) {
            if (err) {
                res.status(400).send('error: ' + err);
            } else {
                // let token =jwt.sign({id: data._id}, "maclesecrete");
                //     let response = {user:data, token:token}
                //     res.send(response);
                res.status(200).send(data)
            }

        })

    })

})

// ME PERMET D'EFFACER UN UTILISATEUR INSCRIT => REGISTER DELETE

app.route('/delete/:user_id').delete(function (req, res) {

    // jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) { })


    User.deleteOne({ _id: req.params.user_id }, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        res.status(200).send({ message: 'register effacé' });
    })

})



//LOGIN
app.route('/login').post(function (req, res) {

    // RAPPEL => ne pas mettre mon req.password (...) EN GROS, DE DONNEES SENSIBLES

    // ATTENTION!!!! pas besoin de jwt puisque, l'utilisareur aura un nouveau token à chacune de ses connexion 
    // =>   jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})


    User.findOne({ email: req.body.email }, function (err, data) {

         if (err) {
            res.status(400).send(err)
        } else {
            
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ id: data._id }, "maclesecrete");
                    let response = { user: data, token: token }
                    res.status(201).send(response);
                }
                else
                    res.status(400).send(err);
            })
        
        }
    })

})


//PERMET DE LIRE L'ENSEMBLE DES LISTES => LISTES DES LISTES (pas très utile en soit ...)

app.route('/list').get(function (req, res) {

    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})

    List.find(function (err, list) {
        if (err) {
            res.status(400).send(err);
        } else
            res.status(201).send(list)
    })

})

// PERMET DE LIRE LES TACHES D'UNE LIST d'un utiliseur 
app.route('list/:id').get(function (req, res) {
    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})
    User.findOne(function (err, list) {
        if (err) {
            res.status(204).send(err)
        } else {
            res.status(200).send(list)
        }
    })
})

app.route('/addList').post(function (req, res) {
    //ici on vérifie le token
    jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("data crée")
            const todolist = new List({
                idUser: decoded.id, //ne pas oublier de faire mon lien ... oui mais où ?
                description: req.body.description
            })
            todolist.save(function (err, list) {
                if (err) {
                    res.send(err);
                } else {
                    res.send(list)
                }
            })
        }
    })
})


// DELETE une list dans /toDoList s'efface   => RAPPEL remove est désapprécié préféré deleteOne()
// PERMET A L'UTILISATEUR D'EFFACER UNE LISTE  => effacer une TODOLISTS

app.route('/delete/:idList').delete(function (req, res) {
    jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) {
        if (err) {
            res.status(400).send(err)
        } else {
            List.deleteOne({ _id: idList.id}, function (err) {
                if (err) {
                    res.status(400).send(err);
                }
                else res.status(201).send({ message: 'todolist effacé' });
            })
        }
    })
})


//PERMET DE LIRE UNE UN ENSEMBLE DE TACHES => 
//ROUTE TASK => Je récupère toutes mes taches
app.route('/task').get(function (req, res) {
    Task.find(function (err, user) {
        if (err) {
            res.status(400).send(err);
        } else
            res.status(201).send(user)
    })
})


//PERMET A L'UTILISATEUR D'AFFICHER UNE TACHE  => addtask 
// addTask
app.route('/addtask').post(function (req, res) {
    //console.log("token : " ,req.headers["x-access-token"] )
   
    jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) {
        if (err) {
            res.status(404).send(err);
        } else {
            let task = new Task({
                idUser: decoded.id,
                description: req.body.description,
                idList: req.body.idList
            })
            task.save(function (err, task) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(201).send(task)
                }
            })
        }
    })
})


//PERMET D'EFFACER UNE TACHE => à sécuriser
// Delete Task  A TESTER

app.route('/delete/:idTask').post(function (req, res) {
    jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) {
        if (err) {
            res.status(400).send(err)
        } else {
            Task.deleteOne({ _id: req.params.idTask }, function (err) {
                if (err) {
                    res.send(err);
                }
                res.send({ message: 'task  effacé' });
            })
        }
    })
})

// Mise en écoute de notre application (sur le port 3000)
app.listen(3000);

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
    res.send('Bienvenue sur ton site  !');

});


//ME PERMET DE LIRE L'ENSEMBLE DE MES UTILISATEURS
app.route('/users').get(function (err, res) {

    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})

    User.find(function (err, user) {
        if (err) {
            res.send(err);
        } else
            res.send(user)
    })
    //.populate('idList')
    //.exec()

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
                res.send('error: ' + err);
            } else {
                // let token =jwt.sign({id: data._id}, "maclesecrete");
                //     let response = {user:data, token:token}
                //     res.send(response);
                res.send(data)
            }

        })

    })

})

// ME PERMET D'EFFACER UN UTILISATEUR INSCRIT => REGISTER DELETE

app.route('/delete/:user_id').delete(function (req, res) {

    jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) { })


    Users.deleteOne({ _id: req.params.user_id }, function (err) {
        if (err) {
            res.send(err);
        }
        res.send({ message: 'register effacé' });
    })

})



//LOGIN
app.route('/login').post(function (req, res) {

    // RAPPEL => ne pas mettre mon req.password (...) EN GROS, DE DONNEES SENSIBLES
    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})


    User.findOne({ email: req.body.email }, function (err, data) {

        if (data) {
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                if (result) {
                    let token = jwt.sign({ id: data._id }, "maclesecrete");
                    let response = { user: data, token: token }
                    res.send(response);

                }

                else
                    res.send(err);
            })
        }
        else if (err) {
            res.send(err)
        } else {
            res.send('pas de data')
        }



    })

})


//PERMET DE LIRE L'ENSEMBLE DES LISTES => LISTES DES LISTES (pas très utile en soit ...)

app.route('/list').get(function (req, res) {

    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})


    List.find(function (err, list) {
        if (err) {
            res.send(err);
        } else
            res.send(list)
    })



})


app.route('/addList').post(function (req, res) {

    //ici on vérifie le token
    jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) {

        if (err) {

            res.send(err)

        } else {

            const todolist = new List({
                idUser: decoded.id, //ne pas oublier de faire mon lien ... oui mais où ?
                description: req.body.description
            })

            todolist.save(function (err, list) {
                if (err) {
                    res.send(err);
                } else {

                    // User.updateOne({_id: req.body.idUser},  { $push: {idList: list._id} }, function (err, user) {
                    //     res.send(user)                    
                    // });

                    res.send(list)

                }

            })
        }
    })
})


// DELETE une list dans /toDoList s'efface   => RAPPEL remove est désapprécié préféré deleteOne()
// PERMET A L'UTILISATEUR D'EFFACER UNE LISTE  => effacer une TODOLISTS

app.route('/delete/:idList').delete(function (req, res) {

    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){}) NECESSAIRE!!!!


    List.deleteOne({ _id: req.params.idList }, function (err) {
        if (err) {
            res.send(err);
        }
        res.send({ message: 'todolist effacé' });
    })

})


//PERMET DE LIRE UNE UN ENSEMBLE DE TACHES => 
//ROUTE TASK => Je récupère toutes mes taches


app.route('/task').get(function (req, res) {

    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})

    Task.find(function (err, user) {
        if (err) {
            res.send(err);
        } else
            res.send(user)
    })



})


//PERMET A L'UTILISATEUR D'AFFICHER UNE TACHE  => addtask 
// addTask
app.route('/addtask').post(function (req, res) {


    console.log("ADDTASK")

    //console.log("token : " ,req.headers["x-access-token"] )
    console.log("req : ", req.headers)
    jwt.verify(req.headers["x-access-token"], "maclesecrete", function (err, decoded) {
        if (err) {
            res.send(err);
        } else {

            let task = new Task({

                idUser: decoded.id,
                description: req.body.description,
                idList: req.body.idList

            })

            task.save(function (err, task) {

                if (err) {
                    res.send(err);

                } else {

                    res.send(task)

                }
            })

        }
    })
})


//PERMET D'EFFACER UNE TACHE => à sécuriser
// Delete Task  A TESTER

app.route('/delete/:idTask').post(function (req, res) {

    // jwt.verify(req.headers["x-access-token"],"maclesecrete", function(err, decoded){})

    Task.deleteOne({ _id: req.params.idTask }, function (err) {

        if (err) {

            res.send(err);

        }

        res.send({ message: 'task  effacé' });

    })


})


// Mise en écoute de notre application (sur le port 3000)
app.listen(3000);

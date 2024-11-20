const { where } = require('sequelize');
const { Tasks } = require('../models/index');

const GetAllTasks = async (req, res,) => {
    try {
        const AllTasks = await Tasks.findAll()
        res.status(200).json({ message: 'All Tasks', tasks: AllTasks });
    } catch (err) {
        console.log(err, "Error Found")
    }

}

const Add = async (req, res) => {
    try {
        await Tasks.create(req.body)
        res.send("task added")
    } catch (err) {
        console.log(err, "Error Found")
    }
};

const Edit = async (req, res) => {
    try {
        await Tasks.update(req.body, { where: { id: req.params.id } })
        res.send("task updated")
    } catch (err) {
        console.log(err, "Error Found")
    }
};

const Delete = async (req, res) => {
    try {
        await Tasks.destroy({ where: { id: req.params.id } })
        res.send("task deleted")
    } catch (err) {
        console.log(err, "Error Found")
    }
}

module.exports = { GetAllTasks, Add, Edit, Delete }
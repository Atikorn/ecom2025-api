const prisma = require("../config/prisma")

exports.createM = async (req, res) => {
    try {
        //code
        const { name, categoryId } = req.body
        const model = await prisma.model.create({
            data: {
                name: name,
                categoryId: parseInt(categoryId)
            }
        })
        res.send(model)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })

    }
}
exports.listM = async (req, res) => {
    try {
        //code
        const model = await prisma.model.findMany()
        res.send(model)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })

    }
}
exports.removeM = async (req, res) => {
    try {
        //code
        const { id } = req.params
        const model = await prisma.model.delete({
            where: {
                id: Number(id)
            }
        })
        res.send(model)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server Error" })

    }
}
const IncomeSchema = require("../models/IncomeModel");

exports.addIncome = async (req, res) => {
    let { title, amount, category, description, date } = req.body;
    amount = Number(amount);
    const income = IncomeSchema({
        title,
        amount,
        category,
        description,
        date
    });

    try {
       
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }
        await income.save();
        res.status(200).json({ message: 'Income Added' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getIncomes = async (req, res) => {
    try {
        const incomes = await IncomeSchema.find().sort({ createdAt: -1 });
        res.status(200).json(incomes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getIncomeById = async (req, res) => {
    const { id } = req.params;
    try {
        const income = await IncomeSchema.findById(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateIncome = async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, description, date } = req.body;

    try {

        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' });
        }
        if (amount <= 0 || typeof amount !== 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' });
        }

        const updatedIncome = await IncomeSchema.findByIdAndUpdate(
            id,
            {
                title,
                amount,
                category,
                description,
                date,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({ message: 'Income not found' });
        }

        res.status(200).json({ 
            message: 'Income Updated Successfully', 
            income: updatedIncome 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server Error',
            error: error.message 
        });
    }
};

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    try {
        const income = await IncomeSchema.findByIdAndDelete(id);
        if (!income) {
            return res.status(404).json({ message: 'Income not found' });
        }
        res.status(200).json({ message: 'Income Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
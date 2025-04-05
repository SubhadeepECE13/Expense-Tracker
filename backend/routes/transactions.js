const { addExpense, getExpense, deleteExpense ,updateExpense} = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome,updateIncome} = require('../controllers/income');

const router = require('express').Router();


router.post('/add-income', addIncome)
    .get('/get-incomes', getIncomes)
    .delete('/delete-income/:id', deleteIncome)
    .post('/add-expense', addExpense)
    .get('/get-expenses', getExpense)
    .delete('/delete-expense/:id', deleteExpense)
    .put('/update-income/:id', updateIncome)
    .put('/update-expense/:id', updateExpense)
module.exports = router
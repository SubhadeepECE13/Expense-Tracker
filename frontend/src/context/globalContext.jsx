import React, { useContext, useState } from "react"
import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/v1/";

const GlobalContext = React.createContext()

export const GlobalProvider = ({children}) => {
    const [incomes, setIncomes] = useState([])
    const [expenses, setExpenses] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    // Income functions
    const addIncome = async (income) => {
        setLoading(true)
        try {
            const response = await axios.post(`${BASE_URL}add-income`, income)
            await getIncomes()
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add income')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getIncomes = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${BASE_URL}get-incomes`)
            setIncomes(response.data)
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch incomes')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateIncome = async (id, incomeData) => {
        setLoading(true)
        try {
            const response = await axios.put(`${BASE_URL}update-income/${id}`, incomeData)
            await getIncomes()
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update income')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteIncome = async (id) => {
        setLoading(true)
        try {
            const response = await axios.delete(`${BASE_URL}delete-income/${id}`)
            await getIncomes()
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete income')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0)
    }

    // Expense functions
    const addExpense = async (expense) => {
        setLoading(true)
        try {
            const response = await axios.post(`${BASE_URL}add-expense`, expense)
            await getExpenses()
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getExpenses = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${BASE_URL}get-expenses`)
            setExpenses(response.data)
            return response.data
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch expenses')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const editExpense = async (id, expenseData) => {
        setLoading(true);
        try {
            const response = await axios.put(`${BASE_URL}update-expense/${id}`, {
                ...expenseData,
                amount: Number(expenseData.amount) 
            });
            await getExpenses();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update expense');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteExpense = async (id) => {
        setLoading(true);
        try {
            const response =  await axios.delete(`${BASE_URL}delete-expense/${id}`);
            await getExpenses();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete expense');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0)
    }

    // Combined functions
    const totalBalance = () => {
        return totalIncome() - totalExpenses()
    }

    const transactionHistory = () => {
        const history = [...incomes, ...expenses]
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt)
        })
        return history.slice(0, 3)
    }

    const getTransactionById = (id, type) => {
        if (type === 'income') {
            return incomes.find(income => income._id === id)
        } else {
            return expenses.find(expense => expense._id === id)
        }
    }

    return (
        <GlobalContext.Provider value={{
            // Income related
            addIncome,
            getIncomes,
            updateIncome,
            deleteIncome,
            incomes,
            totalIncome,
            
            // Expense related
            addExpense,
            getExpenses,
            editExpense,
            deleteExpense,
            expenses,
            totalExpenses,
            
            // Combined
            totalBalance,
            transactionHistory,
            getTransactionById,
            
            // State
            error,
            loading,
            setError
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(GlobalContext)
}
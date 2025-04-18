import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import IncomeItem from '../IncomeItem/IncomeItem';
import ExpenseForm from './ExpenseForm';

function Expenses() {
    const { expenses, getExpenses, deleteExpense, totalExpenses, loading } = useGlobalContext();
    const [editMode, setEditMode] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);

    useEffect(() => {
        getExpenses();
    }, []);

    const handleEditClick = (expense) => {
        setEditMode(true);
        setExpenseToEdit(expense);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setExpenseToEdit(null);
    };

    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>${totalExpenses()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm
                            editMode={editMode}
                            expenseToEdit={expenseToEdit}
                            cancelEdit={cancelEdit}
                        />
                    </div>
                    <div className="incomes">
                        {loading ? (
                            <p className="loading-message">Loading expenses...</p>
                        ) : expenses.length === 0 ? (
                            <p className="no-incomes">No expenses recorded yet</p>
                        ) : (
                            expenses.map((expense) => {
                                const { _id, title, amount, date, category, description, type } = expense;
                                return (
                                    <IncomeItem
                                        key={_id}
                                        id={_id}
                                        title={title}
                                        description={description}
                                        amount={amount}
                                        date={date}
                                        type={type}
                                        category={category}
                                        indicatorColor="var(--color-red)"
                                        deleteItem={deleteExpense}
                                        onEditClick={() => handleEditClick(expense)} 
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
    display: flex;
    overflow: auto;
    
    .total-income {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #FCF6F9;
        border: 2px solid #FFFFFF;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 2rem;
        gap: .5rem;
        
        span {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-red);
        }
    }
    
    .income-content {
        display: flex;
        gap: 2rem;
        
        .form-container {
            flex: 1;
        }
        
        .incomes {
            flex: 1;
            
            .loading-message,
            .no-incomes {
                text-align: center;
                padding: 2rem;
                color: var(--color-grey);
                font-size: 1.2rem;
            }
        }
    }
    
    @media (max-width: 768px) {
        .income-content {
            flex-direction: column;
        }
    }
`;

export default Expenses;
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function ExpenseForm({ editMode, expenseToEdit, cancelEdit }) {
    const { addExpense, editExpense, error, setError } = useGlobalContext();

    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    });

    const { title, amount, date, category, description } = inputState;

    useEffect(() => {
        if (editMode && expenseToEdit) {
            setInputState({
                title: expenseToEdit.title || '',
                amount: expenseToEdit.amount?.toString() || '', // Convert to string for input
                date: expenseToEdit.date ? new Date(expenseToEdit.date) : new Date(),
                category: expenseToEdit.category || '',
                description: expenseToEdit.description || '',
            });
        }
    }, [editMode, expenseToEdit]);

    const handleInput = name => e => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError('');
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        // Allow only numbers and one decimal point
        if (/^[0-9]*\.?[0-9]*$/.test(value)) {
            setInputState({ ...inputState, amount: value });
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!title || !amount || !date || !category) {
            setError('All fields are required except description');
            return;
        }

        // Convert and validate amount
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber) || !isFinite(amountNumber)) {
            setError('Amount must be a valid number');
            return;
        }
        if (amountNumber <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        // Prepare the data to submit
        const expenseData = {
            title,
            amount: amountNumber, // Send as number
            date: date instanceof Date ? date.toISOString() : date,
            category,
            description,
        };

        try {
            if (editMode) {
                await editExpense(expenseToEdit._id, expenseData);
                cancelEdit();
            } else {
                await addExpense(expenseData);
            }
            
            // Reset form only if not in edit mode or after successful edit
            if (!editMode) {
                setInputState({
                    title: '',
                    amount: '',
                    date: '',
                    category: '',
                    description: '',
                });
            }
        } catch (err) {
            // Error will be set by the context function
            console.error("Failed to submit expense:", err);
        }
    };

    return (
        <ExpenseFormStyled onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <div className="input-control">
                <input
                    type="text"
                    value={title}
                    name="title"
                    placeholder="Expense Title"
                    onChange={handleInput('title')}
                    required
                />
            </div>
            <div className="input-control">
                <input
                    value={amount}
                    type="text" // Changed to text for better control
                    inputMode="decimal" // Shows numeric keyboard on mobile
                    name="amount"
                    placeholder="Expense Amount"
                    onChange={handleAmountChange}
                    required
                />
            </div>
            <div className="input-control">
                <DatePicker
                    id="date"
                    placeholderText="Enter A Date"
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => {
                        setInputState({ ...inputState, date });
                        setError('');
                    }}
                    required
                />
            </div>
            <div className="selects input-control">
                <select
                    required
                    value={category}
                    name="category"
                    id="category"
                    onChange={handleInput('category')}
                >
                    <option value="" disabled>Select Option</option>
                    <option value="education">Education</option>
                    <option value="groceries">Groceries</option>
                    <option value="health">Health</option>
                    <option value="subscriptions">Subscriptions</option>
                    <option value="takeaways">Takeaways</option>
                    <option value="clothing">Clothing</option>
                    <option value="travelling">Travelling</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="input-control">
                <textarea
                    name="description"
                    value={description}
                    placeholder="Add A Reference"
                    id="description"
                    cols="30"
                    rows="4"
                    onChange={handleInput('description')}
                ></textarea>
            </div>
            <div className="submit-btn">
                <Button
                    name={editMode ? 'Update Expense' : 'Add Expense'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                    type="submit"
                />
                {editMode && (
                    <Button
                        name="Cancel"
                        bPad={'.8rem 1.6rem'}
                        bRad={'30px'}
                        bg={'#bbb'}
                        color={'#fff'}
                        type="button"
                        onClick={cancelEdit}
                    />
                )}
            </div>
        </ExpenseFormStyled>
    );
}

const ExpenseFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    input, textarea, select {
        font-family: inherit;
        font-size: inherit;
        outline: none;
        border: none;
        padding: .5rem 1rem;
        border-radius: 5px;
        border: 2px solid #fff;
        background: transparent;
        resize: none;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        color: rgba(34, 34, 96, 0.9);

        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    .submit-btn {
        display: flex;
        gap: 1rem;
        button {
            box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
            &:hover {
                background: var(--color-green) !important;
            }
        }
    }

    .error {
        color: var(--color-red);
        font-size: 0.9rem;
        margin-bottom: -1rem;
        text-align: center;
    }
`;

export default ExpenseForm;
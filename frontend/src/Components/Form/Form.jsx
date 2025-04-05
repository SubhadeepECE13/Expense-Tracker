import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { plus } from '../../utils/Icons';

function Form({ isEditing = false, initialValues = {}, onSubmit }) {
    const { addIncome, error, setError } = useGlobalContext();

    const [inputState, setInputState] = useState({
        title: '',
        amount: '',
        date: '',
        category: '',
        description: '',
    });

    useEffect(() => {
        if (isEditing && initialValues) {
            setInputState({
                title: initialValues.title || '',
                amount: initialValues.amount || '',
                date: initialValues.date ? new Date(initialValues.date) : new Date(),
                category: initialValues.category || '',
                description: initialValues.description || '',
            });
        }
    }, [isEditing, initialValues]);

    const { title, amount, date, category, description } = inputState;

    const handleInput = name => e => {
        const value = e.target.value;
        // Special handling for amount field
        if (name === 'amount') {
            // Remove any non-digit characters except decimal point
            const cleanedValue = value.replace(/[^0-9.]/g, '');
            // Ensure only one decimal point
            const finalValue = cleanedValue.replace(/(\..*)\./g, '$1');
            setInputState({ ...inputState, [name]: finalValue });
        } else {
            setInputState({ ...inputState, [name]: value });
        }
        setError('');
    };

    const handleSubmit = e => {
        e.preventDefault();
        
        // Validate required fields
        if (!title || !amount || !date || !category) {
            setError('All fields are required except description');
            return;
        }

        // Convert amount to number and validate
        const amountNumber = parseFloat(amount);
        if (isNaN(amountNumber)) {  // <-- Added missing parenthesis
            setError('Amount must be a valid number');
            return;
        }
        if (amountNumber <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        // Prepare the data to submit
        const submissionData = {
            title,
            amount: amountNumber, // Send as number, not string
            date: date instanceof Date ? date.toISOString() : date,
            category,
            description,
        };

        if (isEditing) {
            onSubmit(submissionData);
        } else {
            addIncome(submissionData);
            // Reset form only for new entries
            setInputState({
                title: '',
                amount: '',
                date: '',
                category: '',
                description: '',
            });
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className='error'>{error}</p>}
            <div className="input-control">
                <input
                    type="text"
                    value={title}
                    name='title'
                    placeholder="Salary Title"
                    onChange={handleInput('title')}
                    required
                />
            </div>
            <div className="input-control">
                <input
                    type="text" // Changed from number to text for better control
                    inputMode="decimal" // Shows numeric keyboard on mobile
                    value={amount}
                    name='amount'
                    placeholder="Salary Amount"
                    onChange={handleInput('amount')}
                    required
                />
            </div>
            <div className="input-control">
                <DatePicker
                    id='date'
                    placeholderText='Enter A Date'
                    selected={date}
                    dateFormat="dd/MM/yyyy"
                    onChange={(date) => setInputState({ ...inputState, date })}
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
                    <option value="salary">Salary</option>
                    <option value="freelancing">Freelancing</option>
                    <option value="investments">Investments</option>
                    <option value="stocks">Stocks</option>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="youtube">YouTube</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div className="input-control">
                <textarea
                    name="description"
                    value={description}
                    placeholder='Add A Reference'
                    id="description"
                    cols="30"
                    rows="4"
                    onChange={handleInput('description')}
                ></textarea>
            </div>
            <div className="submit-btn">
                <Button
                    name={isEditing ? 'Update Income' : 'Add Income'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                    type="submit"
                />
            </div>
        </FormStyled>
    );
}

const FormStyled = styled.form`
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

    .input-control {
        input {
            width: 100%;
        }
    }

    .selects {
        display: flex;
        justify-content: flex-end;
        select {
            color: rgba(34, 34, 96, 0.4);
            &:focus, &:active {
                color: rgba(34, 34, 96, 1);
            }
        }
    }

    .submit-btn {
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
        margin-top: -1rem;
        text-align: center;
    }
`;

export default Form;
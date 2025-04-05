import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Form from '../Form/Form';
import IncomeItem from '../IncomeItem/IncomeItem';

function Income() {
    const { addIncome, incomes, getIncomes, deleteIncome, updateIncome, totalIncome, loading } = useGlobalContext();
    const [editingIncome, setEditingIncome] = useState(null);
    const [updateError, setUpdateError] = useState(null);

    useEffect(() => {
        getIncomes();
    }, []);

    const handleEditClick = (income) => {
        setEditingIncome(income);
        setUpdateError(null);
    };

    const handleCancelEdit = () => {
        setEditingIncome(null);
        setUpdateError(null);
    };

    const handleUpdateIncome = async (updatedIncome) => {
        try {
            setUpdateError(null);
            await updateIncome(editingIncome._id, updatedIncome);
            setEditingIncome(null);
            getIncomes(); // Refresh the list
        } catch (error) {
            console.error("Failed to update income:", error);
            setUpdateError(error.message || "Failed to update income");
        }
    };

    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className="total-income">Total Income: <span>${totalIncome()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        {editingIncome ? (
                            <div className="edit-form">
                                <h3>Edit Income</h3>
                                {updateError && <p className="error-message">{updateError}</p>}
                                <Form
                                    isEditing={true}
                                    initialValues={editingIncome}
                                    onSubmit={handleUpdateIncome}
                                />
                                <button className="cancel-btn" onClick={handleCancelEdit}>
                                    Cancel Edit
                                </button>
                            </div>
                        ) : (
                            <Form />
                        )}
                    </div>
                    <div className="incomes">
                        {loading ? (
                            <p className="loading-message">Loading incomes...</p>
                        ) : incomes.length === 0 ? (
                            <p className="no-incomes">No incomes recorded yet</p>
                        ) : (
                            incomes.map((income) => (
                                <IncomeItem
                                    key={income._id}
                                    id={income._id}
                                    title={income.title}
                                    amount={income.amount}
                                    date={income.date}
                                    category={income.category}
                                    description={income.description}
                                    type={income.type}
                                    indicatorColor="var(--color-green)"
                                    deleteItem={deleteIncome}
                                    onEditClick={() => handleEditClick(income)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
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
            color: var(--color-green);
        }
    }

    .income-content {
        display: flex;
        gap: 2rem;

        .form-container {
            flex: 1;

            .edit-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;

                h3 {
                    color: var(--color-primary);
                    margin-bottom: 0.5rem;
                }

                .error-message {
                    color: var(--color-red);
                    font-size: 0.9rem;
                    margin-bottom: 0.5rem;
                }

                .cancel-btn {
                    padding: 0.8rem 1.6rem;
                    border-radius: 30px;
                    background: var(--color-red);
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s ease;

                    &:hover {
                        background: #ff3a3a;
                    }
                }
            }
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
        padding: 1rem;

        .total-income {
            flex-direction: column;
            font-size: 1.5rem;
            padding: 0.8rem;

            span {
                font-size: 2rem;
            }
        }

        .income-content {
            flex-direction: column;
            gap: 1.5rem;

            .form-container {
                width: 100%;

                .edit-form {
                    h3 {
                        font-size: 1.3rem;
                    }

                    .cancel-btn {
                        padding: 0.6rem 1.2rem;
                        font-size: 0.9rem;
                    }
                }
            }

            .incomes {
                width: 100%;

                .loading-message,
                .no-incomes {
                    padding: 1.5rem;
                    font-size: 1rem;
                }
            }
        }

        ${InnerLayout} {
            padding: 1rem;
        }
    }

    @media (max-width: 480px) {
        .total-income {
            font-size: 1.3rem;

            span {
                font-size: 1.8rem;
            }
        }

        .income-content {
            gap: 1rem;
        }
    }
`;

export default Income;
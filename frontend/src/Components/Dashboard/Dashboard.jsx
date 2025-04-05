import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext';
import History from '../../History/History';
import { InnerLayout } from '../../styles/Layouts';
import { dollar } from '../../utils/Icons';
import Chart from '../Chart/Chart';

function Dashboard() {
    const {totalExpenses, incomes, expenses, totalIncome, totalBalance, getIncomes, getExpenses } = useGlobalContext()

    useEffect(() => {
        getIncomes()
        getExpenses()
    }, [])

    return (
        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-con">
                        <div className="chart-container">
                            <Chart />
                        </div>
                        <div className="amount-con">
                            <div className="income">
                                <h2>Total Income</h2>
                                <p>
                                    {dollar} {totalIncome()}
                                </p>
                            </div>
                            <div className="expense">
                                <h2>Total Expense</h2>
                                <p>
                                    {dollar} {totalExpenses()}
                                </p>
                            </div>
                            <div className="balance">
                                <h2>Total Balance</h2>
                                <p>
                                    {dollar} {totalBalance()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="history-con">
                        <History />
                        <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${Math.min(...incomes.map(item => item.amount))}
                            </p>
                            <p>
                                ${Math.max(...incomes.map(item => item.amount))}
                            </p>
                        </div>
                        <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                        <div className="salary-item">
                            <p>
                                ${Math.min(...expenses.map(item => item.amount))}
                            </p>
                            <p>
                                ${Math.max(...expenses.map(item => item.amount))}
                            </p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .stats-con {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 2rem;
        margin-bottom: 2rem;
        
        .chart-con {
            grid-column: 1 / 4;
            display: flex;
            flex-direction: column;
            gap: 2rem; /* Added gap between chart and amounts */
            
            .chart-container {
                height: 400px;
                overflow: auto;
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                border-radius: 20px;
                padding: 1rem;
            }
            
            .amount-con {
                display: grid;
                grid-template-columns: repeat(3, 1fr); /* Changed to 3 columns */
                gap: 1.5rem; /* Adjusted gap */
                margin-top: 0; /* Removed extra margin */
                
                .income, .expense, .balance {
                    background: #FCF6F9;
                    border: 2px solid #FFFFFF;
                    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 150px; 
                    
                    h2 {
                        margin-bottom: 1rem;
                        font-size: 1rem;
                        text-align: center;
                    }
                    
                    p {
                        font-size: 1.3rem; 
                        font-weight: 700;
                        margin: 0;
                        text-align: center;
                        word-break: break-word;
                    }
                }

                .income p {
                    color: var(--color-green);
                }

                .expense p {
                    color: var(--color-red);
                }

                .balance p {
                    color: var(--color-blue);
                }
            }
        }

        .history-con {
            grid-column: 4 / -1;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            
            h2 {
                margin: 1rem 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .salary-title {
                font-size: 1rem;
                
                span {
                    font-size: 1rem;
                }
            }
            
            .salary-item {
                background: #FCF6F9;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
                padding: 1rem;
                border-radius: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                
                p {
                    font-weight: 600;
                    font-size: 1rem;
                }
            }
        }
    }

    @media (max-width: 1200px) {
        .stats-con {
            grid-template-columns: 1fr;
            
            .chart-con, .history-con {
                grid-column: 1 / -1;
            }
            
            .amount-con {
                grid-template-columns: 1fr !important;
                
                .income, .expense, .balance {
                    width: 120%;
                }
            }
        }
    }
`;

export default Dashboard
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useGlobalContext } from '../../context/globalContext'
import { dateFormat } from '../../utils/dateFormat'

function FinancialTable() {
    const { incomes, expenses, totalExpenses, totalIncome, totalBalance } = useGlobalContext()
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [filterDate, setFilterDate] = useState('')
    const [filterAmount, setFilterAmount] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

    // Combine and format all transactions
    const allTransactions = [
        ...incomes.map(inc => ({ ...inc, type: 'income' })),
        ...expenses.map(exp => ({ ...exp, type: 'expense' }))
    ]

    // Apply sorting
    const sortedTransactions = [...allTransactions].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
    })

    // Apply filters and search
    const filteredTransactions = sortedTransactions.filter(transaction => {
        const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesType = filterType === 'all' || transaction.type === filterType
        
        const matchesDate = !filterDate || dateFormat(transaction.date) === filterDate
        
        const matchesAmount = !filterAmount || 
                             (filterAmount === '<100' && transaction.amount < 100) ||
                             (filterAmount === '100-500' && transaction.amount >= 100 && transaction.amount <= 500) ||
                             (filterAmount === '500-1000' && transaction.amount > 500 && transaction.amount <= 1000) ||
                             (filterAmount === '>1000' && transaction.amount > 1000)
        
        return matchesSearch && matchesType && matchesDate && matchesAmount
    })

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    return (
        <TableStyled>
            <div className="controls">
                <div className="search-filter">
                    <input
                        type="text"
                        placeholder="Search by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All Transactions</option>
                        <option value="income">Income Only</option>
                        <option value="expense">Expenses Only</option>
                    </select>
                    
                    <input
                        type="date"
                        placeholder="Filter by date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                    
                    <select value={filterAmount} onChange={(e) => setFilterAmount(e.target.value)}>
                        <option value="">All Amounts</option>
                        <option value="<100">Less than $100</option>
                        <option value="100-500">$100 - $500</option>
                        <option value="500-1000">$500 - $1000</option>
                        <option value=">1000">More than $1000</option>
                    </select>
                </div>
                
                <div className="summary">
                    <p>Total Income: <span className="income">${totalIncome()}</span></p>
                    <p>Total Expenses: <span className="expense">${totalExpenses()}</span></p>
                    <p>Total Balance: <span className="balance">${totalBalance()}</span></p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('date')}>
                            Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('title')}>
                            Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('description')}>
                            Description {sortConfig.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('amount')}>
                            Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => requestSort('type')}>
                            Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{dateFormat(transaction.date)}</td>
                                <td>{transaction.title}</td>
                                <td>{transaction.description}</td>
                                <td className={transaction.type}>
                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                                </td>
                                <td>
                                    <span className={`badge ${transaction.type}`}>
                                        {transaction.type}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-results">No transactions found matching your criteria</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </TableStyled>
    )
}

const TableStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    border-radius: 20px;
    height: 100%;
    max-height: 500px;
    overflow-y: auto;
    
    .controls {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        
        .search-filter {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            
            input, select {
                padding: 8px;
                border-radius: 5px;
                border: 1px solid #ccc;
                min-width: 150px;
            }
        }
        
        .summary {
            display: flex;
            gap: 20px;
            
            p {
                margin: 0;
                font-weight: 500;
                
                .income { color: green; }
                .expense { color: red; }
                .balance { color: var(--color-blue); }
            }
        }
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        th {
            background-color: #f8f9fa;
            cursor: pointer;
            user-select: none;
            
            &:hover {
                background-color: #e9ecef;
            }
        }
        
        tr:hover {
            background-color: #f5f5f5;
        }
        
        .income {
            color: green;
            font-weight: bold;
        }
        
        .expense {
            color: red;
            font-weight: bold;
        }
        
        .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            
            &.income {
                background-color: rgba(0, 128, 0, 0.1);
                color: green;
            }
            
            &.expense {
                background-color: rgba(255, 0, 0, 0.1);
                color: red;
            }
        }
        
        .no-results {
            text-align: center;
            padding: 20px;
            color: #666;
        }
    }
    
    @media (max-width: 768px) {
        .controls {
            flex-direction: column;
            gap: 10px;
            
            .summary {
                flex-wrap: wrap;
                gap: 10px;
            }
        }
        
        table {
            display: block;
            overflow-x: auto;
        }
    }
`;

export default FinancialTable
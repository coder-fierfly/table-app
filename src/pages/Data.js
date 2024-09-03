import React, { useEffect, useState, useContext } from 'react';
import Message from './Message';
import IterationContext from '../IterationContext';
import { getData, postDelData, postAddData, postChangeData } from '../req/ReqAuthorization';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, IconButton, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function Data({ logout }) {
    const { token } = useContext(IterationContext);
    const [loading, setLoading] = useState(true);  // загрузка
    const [message, setMessage] = useState(''); // сообщение в окне загрузки
    const [tableData, setTableData] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [newRow, setNewRow] = useState({});
    const [titleRow, setTitleRow] = useState({});
    const [changeId, setChangeId] = useState(null);
    const [error, setErr] = useState(false);

    // Функция для создания нового пустого объекта
    const initializeNewRow = (f) => {
        const headers = tableData.length > 0 ? Object.keys(tableData[0]).filter(key => key !== 'id') : [];
        const emptyRow = headers.reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {});
        f(emptyRow);
    };
    const clearInitNewRow = () => {
        setNewRow({}); // Устанавливаем newRow в пустой объект
        initializeNewRow(setNewRow);
    };


    const handleEdit = (id) => {
        const rowToEdit = tableData.find(row => row.id === id);
        if (rowToEdit) {
            const { id, ...rowWithoutId } = rowToEdit;
            setNewRow(rowWithoutId);
        }
        setChangeId(id);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await postDelData(id, setMessage, token);
            handleGetData();
        } finally {
            if (token) {
                setLoading(false);
            }
        }
    };
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const checkData = () => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        if (Object.values(newRow).every(value => value !== null && value !== undefined && value !== '') &&
            dateRegex.test(newRow.companySigDate) && dateRegex.test(newRow.employeeSigDate)) {
            return true;
        } else {
            return false;
        }
    }

    const handleChange = async () => {
        setLoading(true);
        if (checkData()) {
            try {
                setErr(false);
                await postChangeData(changeId, newRow, setMessage, token);
                // await sleep(10000);
                handleGetData();
            } finally {
                setChangeId('')
                setLoading(false);
            }
        } else {
            setErr(true);
            setMessage("данные в форме не корректны")
            setLoading(true);
        }
    }

    const handleInputChange = (e) => {
        setIsEditing({
            ...isEditing,
            [e.target.name]: e.target.value,
        });
    };

    function generateUniqueId() {
        const timestamp = Date.now(); // Получаем количество миллисекунд с 1 января 1970 года
        const randomNum = Math.floor(Math.random() * 1000000); // Случайное число для уникальности
        return `${timestamp}-${randomNum}`;
    }

    const handleAddRow = async () => {
        if (checkData()) {
            const newDataId = generateUniqueId();
            const newData = [{ id: newDataId, ...newRow }];
            setLoading(true);
            try {
                await postAddData(newRow, setMessage, token);
                handleGetData();
            } finally {
                setLoading(false);
            }
            clearInitNewRow();
        } else {
            setErr(true);
            setMessage("данные в форме не корректны")
            setLoading(true);
        }
    };

    const handleGetData = async () => {
        setLoading(true);
        try {
            await getData(token, setTableData, setMessage);
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        setLoading(true);
        handleGetData();
    }, []);

    useEffect(() => {
        initializeNewRow(setNewRow);
        initializeNewRow(setTitleRow);
    }, [tableData]);

    const handleClose = () => {
        setMessage("")
        setLoading(false);
        setErr(false);
    };


    return (
        <div className='main-auth-group'>
            {loading ? <div> <Message isOpen={loading} isError={error} text={message} onClose={handleClose} /></div> : <>
                <div className='scroll'>
                    <div className='exit-btn-wrapper'>
                        <button className='exit-btn' onClick={logout}>выход</button>
                    </div>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {Object.keys(titleRow).map((key) => {
                                        return (
                                            <TableCell key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                                        );
                                    })}
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow key={row.id}>
                                        {Object.keys(row).map((key) => (
                                            key !== 'id' && (
                                                <TableCell key={key}>
                                                    {isEditing?.id === row.id ? (
                                                        <TextField
                                                            name={key}
                                                            value={isEditing[key]}
                                                            onChange={handleInputChange}
                                                        />
                                                    ) : (
                                                        row[key]
                                                    )}
                                                </TableCell>
                                            )
                                        ))}
                                        <TableCell>
                                            <IconButton onClick={() => handleEdit(row.id)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(row.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    {Object.keys(newRow).map((key) => (
                                        <TableCell key={key}>
                                            <TextField
                                                name={key}
                                                value={newRow[key] || ""}
                                                onChange={(e) => setNewRow({ ...newRow, [key]: e.target.value })}
                                                placeholder={`New ${key}`}
                                            />
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        {changeId ? <><Button onClick={handleChange}>Save</Button></> : <Button onClick={handleAddRow}>Add</Button>}

                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
            </>}
        </div>
    );
};

export default Data;
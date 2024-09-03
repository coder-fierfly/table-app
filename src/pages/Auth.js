import React, { useState, useContext } from 'react';
import Message from './Message';
import IterationContext from '../IterationContext';
import { getToken } from '../req/ReqAuthorization'

function Auth() {
    const { token, setToken } = useContext(IterationContext);
    const [logValue, setLogValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [loading, setLoading] = useState(false);  // загрузка
    const [message, setMessage] = useState(''); // сообщение в окне загрузки
    const [error, setErr] = useState(false);

    const handleLogChange = (e) => {
        setLogValue(e.target.value);
    };
    const handlePassChange = (e) => {
        setPassValue(e.target.value);
    };
    const handleLoginClick = async () => {
        setLoading(true);
        try {
            await getToken(logValue, passValue, setToken, setMessage);
        } catch (error) {
            setMessage("Ошибка при входе, проверьте корректность данных")
            setErr(true);
            // Дополнительная обработка ошибок, если нужно
        } finally {
            if (token) {
                setLoading(false);
            }
        }
    };

    const handleClose = () => {
        setLoading(false);
        setErr(false)
        setMessage("")
    };


    return (
        <div className='main-auth-group'>
            {loading ? <div> <Message isOpen={loading} isError={error} text={message} onClose={handleClose} /></div> : <>
                <div className='auth-group'>
                    <p className='auth-label'>Войти</p>
                    <div className='log_group'><p className='log-pass-label'>Логин</p><input className='log-pass-holder'
                        type="text"
                        value={logValue}
                        onChange={handleLogChange}
                    /></div>
                    <div className='log_group'><p className='log-pass-label'>Пароль</p><input className='log-pass-holder'
                        type='password'
                        value={passValue}
                        onChange={handlePassChange}
                    /></div>
                    <div className='enter-btn-wrapper'>
                        <button className='enter-btn' onClick={handleLoginClick}>Войти</button>
                    </div>
                </div>
            </>}
        </div>
    );
};

export default Auth;
const HOST = 'https://test.v5.pryaniky.com';
export const getToken = (username, password, setToken, setMessage) => {
    const url = `${HOST}/ru/data/v3/testmethods/docs/login`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
            .then(response => {
                if (response.status === 2004) {
                    setToken('')
                    reject('Не удалось войти в аккаунт: ' + response.status);
                } else if (!response.ok) {
                    setMessage('Ошибка сервера: ' + response.status);
                    reject('Ошибка сервера: ' + response.status);
                }
                return response.json();
            })
            .then(result => {
                if (!result) return;
                const token = result.data.token;
                setToken(token);
                resolve();
            })
            .catch(error => {
                setMessage('Ошибка при выполнении запроса:', error.message);
                reject(error); // Отклоняем promise в случае ошибки
            });
    })
};

export const getData = (token, setTableData, setMessage) => {
    const url = `${HOST}/ru/data/v3/testmethods/docs/userdocs/get`;

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
            .then(response => {

                if (!response.ok) {
                    setMessage('Ошибка сервера: ' + response.status);
                    reject('Ошибка сервера: ' + response.status)
                }
                return response.json();
            })
            .then(jsonResponse => {
                if (jsonResponse.error) {
                    setMessage("Ошибка " + jsonResponse.error)
                    reject(jsonResponse.error);
                }
                setTableData(jsonResponse.data);
                resolve();
            })
            .catch(error => {
                reject(error); // Отклоняем обещание в случае ошибки
            });
    })
};

export const postDelData = (id, setMessage, token) => {

    const url = `${HOST}/ru/data/v3/testmethods/docs/userdocs/delete/${id}`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            }
        })
            .then(response => {
                if (response.status === 0) {
                    setMessage("Данные успешно удалены");
                    resolve();
                } else if (!response.ok) {
                    setMessage('Ошибка сервера: ' + response.status);
                    reject('Ошибка сервера: ' + response.status)
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data) {
                    resolve(data);
                }
            })
            .catch(error => {
                setMessage('Ошибка при выполнении запроса: ' + error.message);
                reject(error);
            });
    })
}

export const postAddData = (data, setMessage, token) => {
    const url = `${HOST}/ru/data/v3/testmethods/docs/userdocs/create`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify({
                "companySigDate": data.companySigDate,
                "companySignatureName": data.companySignatureName,
                "documentName": data.documentName,
                "documentStatus": data.documentStatus, //ошибка если пустая строка
                "documentType": data.documentType,
                "employeeNumber": data.employeeNumber,
                "employeeSigDate": data.employeeSigDate,
                "employeeSignatureName": data.employeeSignatureName

            })
        })
            .then(response => {
                if (response.status === 200) {
                    resolve();
                } else if (!response.ok) {
                    setMessage('Ошибка сервера: ' + response.status);
                    reject('Ошибка сервера: ' + response.status)
                }
                return response.json();
            })
            .catch(error => {
                setMessage('Ошибка при выполнении запроса:', error);
                reject('Ошибка при выполнении запроса:', error);
            });
    })
}

export const postChangeData = (id, data, setMessage, token) => {
    const url = `${HOST}/ru/data/v3/testmethods/docs/userdocs/set/${id}`;
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-auth': token
            },
            body: JSON.stringify({
                "companySigDate": data.companySigDate,
                "companySignatureName": data.companySignatureName,
                "documentName": data.documentName,
                "documentStatus": data.documentStatus,
                "documentType": data.documentType,
                "employeeNumber": data.employeeNumber,
                "employeeSigDate": data.employeeSigDate,
                "employeeSignatureName": data.employeeSignatureName
            })
        })
            .then(response => {
                if (response.status === 200) {
                    resolve();
                } else if (!response.ok) {
                    setMessage('Ошибка сервера: ' + response.status);
                    reject('Ошибка сервера: ' + response.status);
                }
                return response.json();
            })
            .catch(error => {
                setMessage('Ошибка при выполнении запроса:', error);
                reject('Ошибка при выполнении запроса:', error);
            });
    })
}
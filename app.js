let authToken = '';

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    authToken = btoa(`${username}:${password}`);
    sessionStorage.setItem('authToken', authToken);
    window.location.href = 'records.html';
});

document.addEventListener('DOMContentLoaded', function() {
    authToken = sessionStorage.getItem('authToken');
    if (authToken && window.location.pathname.endsWith('records.html')) {
        fetchRecords();
    }
});

function fetchRecords() {
    fetch('https://www.pollosapipilcomayo.somee.com/api/Principal', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${authToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('recordsTableBody');
        tableBody.innerHTML = '';
        data.forEach(record => {
            const row = `<tr>
                <td>${record.id}</td>
                <td>${record.nombre}</td>
                <td>${record.plato}</td>
                <td>${record.observacion || ''}</td>
                <td>${record.precio}</td>
                <td>
                    <button onclick="editRecord(${record.id})">Editar</button>
                    <button onclick="deleteRecord(${record.id})">Eliminar</button>
                </td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    });
}

function createRecord(record) {
    fetch('https://www.pollosapipilcomayo.somee.com/api/Principal', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
    }).then(() => {
        window.location.href = 'records.html';
    });
}

function deleteRecord(id) {
    fetch(`https://www.pollosapipilcomayo.somee.com/api/Principal/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Basic ${authToken}`
        }
    }).then(() => {
        fetchRecords();
    });
}

function editRecord(id) {
    fetch(`https://www.pollosapipilcomayo.somee.com/api/Principal/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${authToken}`
        }
    })
    .then(response => response.json())
    .then(record => {
        sessionStorage.setItem('recordToEdit', JSON.stringify(record));
        window.location.href = 'edit.html';
    });
}

document.getElementById('createForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const record = {
        id: 0,
        nombre: document.getElementById('nombre').value,
        plato: parseInt(document.getElementById('plato').value),
        observacion: document.getElementById('observacion').value || null,
        precio: parseFloat(document.getElementById('precio').value)
    };
    createRecord(record);
});

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('edit.html')) {
        const record = JSON.parse(sessionStorage.getItem('recordToEdit'));
        document.getElementById('edit-id').value = record.id;
        document.getElementById('edit-nombre').value = record.nombre;
        document.getElementById('edit-plato').value = record.plato;
        document.getElementById('edit-observacion').value = record.observacion || '';
        document.getElementById('edit-precio').value = record.precio;
    }
});

document.getElementById('editForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const record = {
        id: parseInt(document.getElementById('edit-id').value),
        nombre: document.getElementById('edit-nombre').value,
        plato: parseInt(document.getElementById('edit-plato').value),
        observacion: document.getElementById('edit-observacion').value || null,
        precio: parseFloat(document.getElementById('edit-precio').value)
    };
    updateRecord(record);
});

function updateRecord(record) {
    fetch(`https://www.pollosapipilcomayo.somee.com/api/Principal/`, {
        method: 'PUT',
        headers: {
            'Authorization': `Basic ${authToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(record)
    }).then(() => {
        window.location.href = 'records.html';
    });
}

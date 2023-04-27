

const employeeForm = document.getElementById('createEmployeeForm');

employeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(employeeForm);

    employeeForm.reset();

    const res = await fetch('/user/create-employee', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });

    const data = await res.json();

    if(data.status == 'successful'){
        swal(data.message, {
            icon: 'success'
        }).then(() => {
            window.location.href = '/login';
        });
    }else{
        swal(data.message, {
            icon: 'error'
        })
    }

})
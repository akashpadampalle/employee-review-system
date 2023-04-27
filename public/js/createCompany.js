
swal('Admin will be created Along Side', 'while creating company we create admin alongside it to maintain feedbacks and all things', 'info');

const companyForm = document.getElementById('createCompanyForm');

companyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(companyForm);

    companyForm.reset();

    const res = await fetch('/user/create-company', {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    });

    const data = await res.json();

    if(data.status == 'successful'){
        swal(data.message, {
            icon: 'success',
            button: 'login now'
        }).then(() => {
            window.location.href = '/login';
        })
    }else{
        swal(data.message, {
            icon: 'error'
        })
    }

})
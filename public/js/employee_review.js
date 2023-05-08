console.log('employee review script loaded');


const feedbackGiverList = document.getElementById('feedback-giver-list');
const deleteEmployeeBtn = document.getElementById('delete-employee-btn');


feedbackGiverList.addEventListener('click', async (e) => {
    const target = e.target;

    if (target.classList.contains('ask-feedback-btn')) {
        const giverId = target.parentElement.dataset.id;
        const recieverId = feedbackGiverList.dataset.id;

        const response = await fetch('/user/ask-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recieverId, giverId })
        })

        const result = await response.json();

        if (result.status == 'successful') {
            target.classList.remove('btn-success', 'ask-feedback-btn');
            target.classList.add('btn-secondary', 'cancel-feedback-btn');

            target.innerText = 'cancel';
        }


    } else if (target.classList.contains('cancel-feedback-btn')) {

        const giverId = target.parentElement.dataset.id;
        const recieverId = feedbackGiverList.dataset.id;

        const response = await fetch('/user/cancel-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ recieverId, giverId })
        })

        const result = await response.json();

        if (result.status == 'successful') {
            target.classList.add('btn-success', 'ask-feedback-btn');
            target.classList.remove('btn-secondary', 'cancel-feedback-btn');

            target.innerText = 'Ask';
        }

    }
})


deleteEmployeeBtn.addEventListener('click', async (e) => {
    swal({
        title: "Delete Employee!",
        text: "after deleting employee, its feedbacks and employee details will no longer available",
        icon: "warning",
        dangerMode: true,
        buttons: true
    }).then(async (value) => {
        if (value) {


            const response = await fetch('/user/employee', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'employeeId': deleteEmployeeBtn.dataset.id })
            })


            const result = await response.json();

            if (result.status == 'successful') {
                swal({
                    title: `${result.message}`,
                    icon: 'success'
                });

                window.location.href = '/user/admin';

            } else {
                swal({
                    title: `${result.message}`,
                    icon: 'error'
                })
            }
        }
    })
})
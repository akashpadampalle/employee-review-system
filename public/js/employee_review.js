console.log('employee review script loaded');


const feedbackGiverList = document.getElementById('feedback-giver-list');


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
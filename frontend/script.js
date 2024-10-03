document.addEventListener('DOMContentLoaded', function () {
    const jobForm = document.getElementById('jobForm');
    const jobList = document.getElementById('jobList');

    // Função para carregar as vagas
    async function loadJobs() {
        try {
            const response = await fetch('http://localhost:5000/api/jobs'); // URL da API
            if (!response.ok) {
                throw new Error(`Erro ao carregar vagas: ${response.statusText}`);
            }
            const jobs = await response.json();
            jobList.innerHTML = '';

            jobs.forEach(job => {
                const jobItem = document.createElement('div');
                jobItem.classList.add('job-item');
                jobItem.innerHTML = `
                    <h3>${job.title}</h3>
                    <p>${job.description}</p>
                    <p>${job.company}</p>
                    <p>Localização: ${job.location.coordinates[0]}, ${job.location.coordinates[1]}</p>
                `;
                jobList.appendChild(jobItem);
            });
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    // Evento de envio do formulário
    jobForm.onsubmit = async function (event) {
        event.preventDefault();

        const formData = new FormData(jobForm);
        const jobData = {
            title: formData.get('title'),
            description: formData.get('description'),
            company: formData.get('company'),
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(formData.get('longitude')), // Certifique-se de que esses valores são numéricos
                    parseFloat(formData.get('latitude'))
                ]
            }
        };

        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                alert('Vaga adicionada com sucesso!');
                loadJobs();
                jobForm.reset();
            } else {
                const error = await response.json();
                alert(`Erro ao adicionar vaga: ${error.message}`);
            }
        } catch (error) {
            console.error('Erro ao enviar a vaga:', error);
            alert('Erro ao enviar a vaga. Tente novamente.');
        }
    };

    loadJobs(); // Carrega as vagas ao iniciar
});

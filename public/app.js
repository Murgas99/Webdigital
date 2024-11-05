// Definir las URLs de las guías alojadas en OneDrive
const urlsGuia = {
    MIT: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/EXQKJITOrFxHiHBXW0i3yh8BN-nPPJW64WKNkJ4MS5xlVw?e=Plgh2m',
    RocaSalvatella: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/Eb6xIn-ZdMJDu_KerjUGFUUBC7bgsbmrep-pnPo9ME4ccg?e=pKz3Ba',
    Rogers: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/Ea51jcLnZsZDgLuR2V0dtGEBXBRa-WCT6oKvP2ghbP4ngA?e=qo3i19',
    Incipy: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/EVSERhVUQ2xGqWwr4iiBk88BuVD10292i7_2srHy6zX1ZQ?e=bxyWYk'
};

document.getElementById('encuestaForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const overlay = document.getElementById('overlay');
    overlay.style.visibility = 'visible';

    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const nombreEmpresa = document.getElementById('nombreEmpresa').value;
    const nit = document.getElementById('nit').value;

    if (nombreResponsable.trim() === "" || nombreEmpresa.trim() === "" || nit.trim() === "") {
        alert("Por favor, complete todos los campos: Nombre del Responsable, Nombre de la Empresa, y NIT.");
        overlay.style.visibility = 'hidden';
        return;
    }

    let mit = 0, rocaSalvatella = 0, rogers = 0, incipy = 0;
    let respuestas = []; 

    for (let i = 1; i <= 28; i++) {
        const respuestaSeleccionada = document.querySelector(`input[name="q${i}"]:checked`);
        if (respuestaSeleccionada) {
            respuestas.push(respuestaSeleccionada.value);
            const modelo = respuestaSeleccionada.value;
            if (modelo === 'MIT') mit++;
            else if (modelo === 'RocaSalvatella') rocaSalvatella++;
            else if (modelo === 'Rogers') rogers++;
            else if (modelo === 'Incipy') incipy++;
        } else {
            alert(`Por favor, responde la pregunta ${i}.`);
            overlay.style.visibility = 'hidden';
            return;
        }
    }

    fetch('https://script.google.com/macros/s/AKfycbz3J9s6e7tcctu3m97oBRRT9uCvAHrsS1uDLAw54TQ7C54_R1-5x2X0HjpODKnNR1EBRw/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nombreResponsable=${encodeURIComponent(nombreResponsable)}&nombreEmpresa=${encodeURIComponent(nombreEmpresa)}&nit=${encodeURIComponent(nit)}&respuestas=${encodeURIComponent(JSON.stringify(respuestas))}`
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error("Error al guardar los datos en Google Sheets:", error);
    });

    setTimeout(() => {
        const resultados = [
            { modelo: 'MIT', puntos: mit },
            { modelo: 'RocaSalvatella', puntos: rocaSalvatella },
            { modelo: 'Rogers', puntos: rogers },
            { modelo: 'Incipy', puntos: incipy }
        ];

        resultados.sort((a, b) => b.puntos - a.puntos);

        const maxPuntos = resultados[0].puntos;
        const modelosEmpatados = resultados.filter(result => result.puntos === maxPuntos);

        let resultadoTexto;
        if (modelosEmpatados.length > 1) {
            const nombresModelos = modelosEmpatados.map(result => result.modelo).join(' y ');
            const modeloAleatorio = modelosEmpatados[Math.floor(Math.random() * modelosEmpatados.length)];
            const urlGuia = urlsGuia[modeloAleatorio.modelo];

            resultadoTexto = `Teniendo en cuenta las respuestas obtenidas de la encuesta, se analizan que puedes implementar los modelos ${nombresModelos}. Sin embargo, considerando el comportamiento de las respuestas y el aprendizaje obtenido, el modelo recomendado para tu modelo de negocio es: ${modeloAleatorio.modelo}. Puedes revisar la guía del modelo aquí: <a href="${urlGuia}" target="_blank">Ver guía de ${modeloAleatorio.modelo}</a>.`;
        } else {
            const modeloGanador = resultados[0].modelo;
            const urlGuia = urlsGuia[modeloGanador];
            resultadoTexto = `${modeloGanador} es el modelo más adecuado para ti. Puedes revisar la guía del modelo aquí: <a href="${urlGuia}" target="_blank">Ver guía de ${modeloGanador}</a>.`;
        }

        overlay.style.visibility = 'hidden';
        const resultadoModal = document.getElementById('resultadoModal');
        resultadoModal.style.visibility = 'visible';
        document.getElementById('resultado').innerHTML = resultadoTexto;
    }, 1500);
});

document.getElementById('cerrarResultado').addEventListener('click', function() {
    const resultadoModal = document.getElementById('resultadoModal');
    resultadoModal.style.visibility = 'hidden';
});

// Definir las URLs de las guías alojadas en OneDrive
const urlsGuia = {
    MIT: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/EacOGIlkc7NJnNtMNK4RPHIB_-VrphpjygI0OZXH4CuCwg?e=KjyKj8', // URL de la guía MIT en OneDrive
    RocaSalvatella: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/EW1OzLgjP9RBkr3-nzkZVBYBaeuE6jBYZzkoM9IQte2zvw?e=oywjwZ', // URL de la guía RocaSalvatella en OneDrive
    Rogers: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/EYY_IqhlGjZHinxFLgfBP9gB4F3mTf53vDM5jaa-OoFOtQ?e=tOT6xT', // URL de la guía Rogers en OneDrive
    Incipy: 'https://unilibrebog-my.sharepoint.com/:b:/g/personal/andresa-murgasv_unilibre_edu_co/EeIpv3J1LcdOj2mnr9V7Gx8Blq0QXWUf1nY0jJXuOZMpWg?e=9H96U6' // URL de la guía Incipy en OneDrive
};

document.getElementById('encuestaForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío real del formulario
    
    // Mostrar el overlay con la animación de carga
    const overlay = document.getElementById('overlay');
    overlay.style.visibility = 'visible';

    // Capturar los datos del responsable, empresa y NIT
    const nombreResponsable = document.getElementById('nombreResponsable').value;
    const nombreEmpresa = document.getElementById('nombreEmpresa').value;
    const nit = document.getElementById('nit').value;
    
    let mit = 0, rocaSalvatella = 0, rogers = 0, incipy = 0;
    let respuestas = []; // Array para almacenar las respuestas seleccionadas

    // Recorrer cada pregunta y sumar puntos para el modelo correspondiente
    for (let i = 1; i <= 28; i++) {
        const respuestaSeleccionada = document.querySelector(`input[name="q${i}"]:checked`);
        if (respuestaSeleccionada) {
            respuestas.push(respuestaSeleccionada.value); // Agregar la respuesta al array
            const modelo = respuestaSeleccionada.value;
            if (modelo === 'MIT') mit++;
            else if (modelo === 'RocaSalvatella') rocaSalvatella++;
            else if (modelo === 'Rogers') rogers++;
            else if (modelo === 'Incipy') incipy++;
        } else {
            respuestas.push('No respondido'); // Agregar "No respondido" si la pregunta no fue respondida
        }
    }

    // Enviar los datos a Google Sheets
    fetch('https://script.google.com/macros/s/AKfycbz3J9s6e7tcctu3m97oBRRT9uCvAHrsS1uDLAw54TQ7C54_R1-5x2X0HjpODKnNR1EBRw/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nombreResponsable=${encodeURIComponent(nombreResponsable)}&nombreEmpresa=${encodeURIComponent(nombreEmpresa)}&nit=${encodeURIComponent(nit)}&respuestas=${encodeURIComponent(JSON.stringify(respuestas))}`
    })
    .then(response => response.text())
    .then(data => {
        console.log(data); // Muestra el mensaje de éxito o error
        
    })
    .catch(error => {
        console.error("Error al guardar los datos en Google Sheets:", error);
    });

    // Simular procesamiento (1.5 segundos)
    setTimeout(() => {
        // Determinar el modelo con más puntos
        const resultados = [
            { modelo: 'MIT', puntos: mit },
            { modelo: 'RocaSalvatella', puntos: rocaSalvatella },
            { modelo: 'Rogers', puntos: rogers },
            { modelo: 'Incipy', puntos: incipy }
        ];

        // Ordenar por mayor cantidad de puntos
        resultados.sort((a, b) => b.puntos - a.puntos);

        // Determinar si hay empate
        const maxPuntos = resultados[0].puntos;
        const modelosEmpatados = resultados.filter(result => result.puntos === maxPuntos);

        let resultadoTexto;
        if (modelosEmpatados.length > 1) {
            const modelos = modelosEmpatados.map(result => result.modelo).join(' y ');
            resultadoTexto = `Teniendo en cuenta las necesidades de tu empresa, existe un empate entre los modelos: ${modelos}. Puedes elegir cualquiera de ellos.`;
        } else {
            const modeloGanador = resultados[0].modelo;
            const urlGuia = urlsGuia[modeloGanador];  // Obtiene la URL de la guía correspondiente
            resultadoTexto = `${modeloGanador} es el modelo más adecuado para ti. Puedes revisar la guía del modelo aquí: <a href="${urlGuia}" target="_blank">Ver guía de ${modeloGanador}</a>.`;
        }

        // Ocultar el overlay y mostrar el resultado
        overlay.style.visibility = 'hidden'; // Ocultar el overlay
        const resultadoModal = document.getElementById('resultadoModal');
        resultadoModal.style.visibility = 'visible'; // Mostrar el modal con el resultado
        document.getElementById('resultado').innerHTML = resultadoTexto; // Usar innerHTML para incluir el link
    }, 1500); // Esperar 1.5 segundos antes de mostrar el resultado
});

// Cerrar el modal de resultado
document.getElementById('cerrarResultado').addEventListener('click', function() {
    const resultadoModal = document.getElementById('resultadoModal');
    resultadoModal.style.visibility = 'hidden';
});








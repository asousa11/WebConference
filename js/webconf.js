window.onload = {
    // código para manipulação DOM
}

const btnRegister = document.getElementById("btnRegister")
btnRegister.addEventListener("click", function() {
    // Abertura de uma janela modal
    Swal.fire({
        title: "Inscrição na WebConference",
        html:
            '<input id="txtName" class="swal2-input" placeholder="name">'+
            '<input id="txtEmail" class="swal2-input" placeholder="e-mail">',
        showCancelButton: true,
        confirmButtonText: "Inscrever",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const name = document.getElementById('txtName').value
            const email = document.getElementById('txtEmail').value
            const url_base = "https://fcawebbook.herokuapp.com"
            return
                fetch('${url_base/conferences/1/participants/${email}',{
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    method: "POST",
                    body: 'nomeparticipant=${name}'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return response.json();
                })
                .catch(error => {
                    swal.showValidationError('Pedido falhou: ${error}');
                });
        },
        allowOutsideClick: () => !swal.isLoading()
    }).then(result => {
        if (!result.value) {
            swal({title: "Inscrição feita com sucesso!"})
        } else {
            swal({title: '${result.value.err_message}'})
        }
    })
})

( async () => {
    const renderSpeakers = document.getElementById("renderSpeakers")
    let txtSpeakers = ""
    const response = await fetch('${url_Base}/conference/1/speakers')
    const speakers = await response.json()

    for (const speaker of speakers) {
        txtSpeakers += `
            <div class="col-sm-4">
                <div class="team-member">
                    <!--Orador nº1-->
                    <img id="${speaker.idSpeaker}" class="mx-auto rounded-circle viewSpeaker" src="img/team/1.jpg" alt="Primeiro Orador">
                    <h4>André Baptista</h4>
                    <p class="text-muted">Security Engineer</p>
                    <ul class="list-inline social-buttons">`
        if (speaker.twitter !== null) {
            txtSpeakers.txtSpeakers += `
                <li class="list-inline-item">
                    <a href="#"><i class="fab fa-twitter"></i></a>
                </li>`
        }
        if (speaker.facebook !== null) {
            txtSpeakers.txtSpeakers += `
                <li class="list-inline-item">
                    <a href="#"><i class="fab fa-facebook.f"></i></a>
                </li>`
        }
        if (speaker.linkedin !== null) {
            txtSpeakers.txtSpeakers += `
                <li class="list-inline-item">
                    <a href="#"><i class="fab fa-linkedin-in"></i></a>
                </li>`
        }
        txtSpeakers += `
                    </ul>
                </div>
            </div>`
    }
    const btnView = document.getElementsByClassName("viewSpeaker")
    for (let i=0; i < btnView.length; i++) {
        btnView[i].addEventListener("click", () => {
            for (const speaker of speakers) {
                if (speaker.idSpeaker == btnView[i].getAttribute("id")) {
                    // janela modal
                    Swal.fire({
                        title: speaker.nome,
                        text: speaker.bio,
                        imageUrl: speaker.foto,
                        imageWidth: 400,
                        imageHeight: 400,
                        imageAlt: 'Foto do Orador',
                        animation: false
                    })
                }
            }
        })
    }
    renderSpeakers.innerHTML = txtSpeakers
}) ()
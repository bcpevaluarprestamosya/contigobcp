/* =========================================================
                    ELEMENTOS GENERALES
========================================================= */

// Pantallas principales
const pantalla1 = document.getElementById("pantalla1");
const pantalla2 = document.getElementById("pantalla2");
const pantalla3 = document.getElementById("pantalla3");
const pantalla4 = document.getElementById("pantalla4");

// Loader
const loader = document.getElementById("loader");


/* =========================================================
                    DATOS DE LA SOLICITUD
========================================================= */

const datosSolicitud = {

    dni: "",
    monto: 0,
    meses: 0,
    celular: "",
    planElegido: null

};


/* =========================================================
                    FUNCIONES GENERALES
========================================================= */

// Mostrar una pantalla principal
function mostrarPantalla(pantalla) {

    const pantallas = [
        pantalla1,
        pantalla2,
        pantalla3,
        pantalla4
    ];

    pantallas.forEach(function (p) {

        if (p) {
            p.classList.remove("activa");
        }

    });

    if (pantalla) {
        pantalla.classList.add("activa");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Mostrar loader
function mostrarLoader() {

    if (loader) {
        loader.style.display = "flex";
    }

}


// Ocultar loader
function ocultarLoader() {

    if (loader) {
        loader.style.display = "none";
    }

}


/* =========================================================
                    PANTALLA 1
========================================================= */

const dni = document.getElementById("dni");
const btnDescubrir = document.getElementById("btnDescubrir");
const mensajeError = document.getElementById("mensaje-error");


// Validar DNI
function validarDNI() {

    if (!dni) return;

    // Solo números
    dni.value = dni.value
        .replace(/\D/g, "")
        .slice(0, 8);

    const valor = dni.value;

    if (valor.length === 8) {

        btnDescubrir.disabled = false;

        if (mensajeError) {
            mensajeError.classList.remove("mostrar");
        }

    } else {

        btnDescubrir.disabled = true;

    }

}


// Validar mientras escribe
dni.addEventListener("input", validarDNI);


// Mostrar error
function mostrarError() {

    if (mensajeError) {
        mensajeError.classList.add("mostrar");
    }

}


// Botón descubrir
btnDescubrir.addEventListener("click", function () {

    const valorDNI = dni.value;

    if (!/^\d{8}$/.test(valorDNI)) {

        mostrarError();
        return;

    }


    // Guardar DNI
    datosSolicitud.dni = valorDNI;


    // Loader
    mostrarLoader();


    setTimeout(function () {

        ocultarLoader();

        mostrarPantalla(pantalla2);

    }, 1200);

});


/* =========================================================
                    PANTALLA 2
========================================================= */

const btnSolicitar =
    document.getElementById("btnSolicitar");


btnSolicitar.addEventListener("click", function () {

    mostrarLoader();


    setTimeout(function () {

        ocultarLoader();

        mostrarPantalla(pantalla3);

    }, 1000);

});


/* =========================================================
                    PANTALLA 3
========================================================= */

const monto =
    document.getElementById("monto");

const meses =
    document.getElementById("meses");

const celular =
    document.getElementById("celular");

const btnEmpezar =
    document.getElementById("btnEmpezar");


// Validar formulario
function validarFormulario() {

    const montoValor = Number(monto.value);

    const mesesValor = meses.value;

    const celularValor = celular.value;


    // Monto válido
    const montoValido =
        montoValor > 0;


    // Meses seleccionados
    const mesesValido =
        mesesValor !== "";


    // Celular peruano de 9 dígitos
    const celularValido =
        /^9\d{8}$/.test(celularValor);


    // Activar botón
    btnEmpezar.disabled = !(
        montoValido &&
        mesesValido &&
        celularValido
    );

}


// Monto
monto.addEventListener("input", function () {

    // Evitar negativos
    if (Number(monto.value) < 0) {
        monto.value = "";
    }

    validarFormulario();

});


// Meses
meses.addEventListener("change", function () {

    validarFormulario();

});


// Celular
celular.addEventListener("input", function () {

    celular.value = celular.value
        .replace(/\D/g, "")
        .slice(0, 9);

    validarFormulario();

});


/* =========================================================
                PANTALLA 3 → PANTALLA 4
========================================================= */

btnEmpezar.addEventListener("click", function () {

    // Seguridad
    if (btnEmpezar.disabled) {
        return;
    }


    // Guardar información
    datosSolicitud.monto =
        Number(monto.value);

    datosSolicitud.meses =
        Number(meses.value);

    datosSolicitud.celular =
        celular.value;


    // Generar planes
    generarPlanes();


    // Mostrar loader
    mostrarLoader();


    setTimeout(function () {

        ocultarLoader();

        mostrarPantalla(pantalla4);

    }, 1000);

});


/* =========================================================
                    PANTALLA 4
========================================================= */

const planesPago =
    document.getElementById("planesPago");


/* =========================================================
                    CÁLCULO DEL PLAN
========================================================= */

function calcularPlan(
    montoSolicitado,
    cantidadMeses,
    tasaMensual
) {

    const intereses =
        montoSolicitado *
        tasaMensual *
        cantidadMeses;


    const total =
        montoSolicitado +
        intereses;


    const cuota =
        total / cantidadMeses;


    return {

        intereses: intereses,
        total: total,
        cuota: cuota

    };

}


/* =========================================================
                    FORMATO SOLES
========================================================= */

function formatoSoles(valor) {

    return "S/ " + Number(valor).toFixed(2);

}


/* =========================================================
                    GENERAR PLANES
========================================================= */

function generarPlanes() {

    const montoSolicitado =
        Number(datosSolicitud.monto);

    const cantidadMeses =
        Number(datosSolicitud.meses);


    // ÚNICO PLAN
    const planMenosIntereses =
        calcularPlan(
            montoSolicitado,
            cantidadMeses,
            0.0034
        );


    const plan = {

        ...planMenosIntereses,

        monto: montoSolicitado,

        meses: cantidadMeses,

        tasa: 0.0034

    };


    // Limpiar tarjetas anteriores
    planesPago.innerHTML = "";


    // Crear SOLO UNA tarjeta
    planesPago.appendChild(
        crearTarjetaPlan(plan, 0)
    );

}

/* =========================================================
                    CREAR TARJETA
========================================================= */

function crearTarjetaPlan(plan, indice) {

    const tarjeta =
        document.createElement("article");


    tarjeta.className =
        "plan-card";


    // Destacar primer plan
    if (indice === 0) {

        tarjeta.classList.add("destacado");

    }


    // Badge
    const badge =
        indice === 0
            ? `
                <div class="plan-badge">
                    Menos intereses
                </div>
              `
            : "";


    tarjeta.innerHTML = `

        ${badge}

        <div class="plan-datos">

            <span class="plan-etiqueta">
                Cuota mensual
            </span>

            <strong>
                ${formatoSoles(plan.cuota)}
            </strong>


            <span class="plan-etiqueta">
                Número de<br>cuotas
            </span>

            <strong>
                ${plan.meses}
            </strong>


            <span class="plan-etiqueta">
                Pago total
            </span>

            <strong>
                ${formatoSoles(plan.total)}
            </strong>

        </div>


        <button
            class="btn-elegir"
            type="button"
        >
            Elegir
        </button>

    `;


    const btnElegir =
        tarjeta.querySelector(".btn-elegir");


    /* =====================================================
                ELEGIR PLAN
    ===================================================== */

    btnElegir.addEventListener("click", function () {

        // Guardar plan
        datosSolicitud.planElegido = plan;


        // Loader
        mostrarLoader();


        setTimeout(function () {

            ocultarLoader();

            mostrarPaso2();

        }, 800);

    });


    return tarjeta;

}


/* =========================================================
                PASO 2
            CONFIRMAR DATOS
========================================================= */

function mostrarPaso2() {

    const contenido =
        document.querySelector(".pantalla4-contenido");


    if (!contenido) return;


    contenido.innerHTML = `

        <div class="progreso" id="progreso">

            <div class="paso completado">
                <span>✓</span>
            </div>

            <div class="linea completada"></div>

            <div class="paso completado">
                <span>✓</span>
            </div>

            <div class="linea activa"></div>

            <div class="paso activo">
                <span>3</span>
            </div>

        </div>


        <h1 class="titulo-plan">
            Confirma los datos de tu préstamo
        </h1>


        <div class="confirmar-datos">

            <div class="dato-confirmacion">
                <span>DNI</span>
                <strong>
                    ${datosSolicitud.dni}
                </strong>
            </div>


            <div class="dato-confirmacion">
                <span>Celular</span>
                <strong>
                    ${datosSolicitud.celular}
                </strong>
            </div>


            <div class="dato-confirmacion">
                <span>Monto solicitado</span>
                <strong>
                    ${formatoSoles(datosSolicitud.monto)}
                </strong>
            </div>


            <div class="dato-confirmacion">
                <span>Número de cuotas</span>
                <strong>
                    ${datosSolicitud.meses}
                </strong>
            </div>


            <div class="dato-confirmacion">
                <span>Cuota mensual</span>
                <strong>
                    ${formatoSoles(
                        datosSolicitud.planElegido.cuota
                    )}
                </strong>
            </div>


            <div class="dato-confirmacion">
                <span>Pago total</span>
                <strong>
                    ${formatoSoles(
                        datosSolicitud.planElegido.total
                    )}
                </strong>
            </div>


            <button
                id="btnConfirmar"
                class="btn-empezar"
                type="button"
            >
                Confirmar préstamo
            </button>

        </div>

    `;


    // Botón confirmar
    const btnConfirmar =
        document.getElementById("btnConfirmar");


    btnConfirmar.addEventListener(
        "click",
        confirmarPrestamo
    );


}


/* =========================================================
                PASO 3
            CONFIRMACIÓN FINAL
========================================================= */

function confirmarPrestamo() {

    mostrarLoader();


    setTimeout(function () {

        ocultarLoader();

        mostrarPaso3();

    }, 1000);

}


/* =========================================================
                PASO 3
            MOSTRAR CONFIRMACIÓN
========================================================= */

function mostrarPaso3() {

    const contenido =
        document.querySelector(".pantalla4-contenido");


    if (!contenido) return;


    const plan =
        datosSolicitud.planElegido;


    contenido.innerHTML = `

        <div class="progreso" id="progreso">

            <div class="paso completado">
                <span>✓</span>
            </div>

            <div class="linea completada"></div>

            <div class="paso completado">
                <span>✓</span>
            </div>

            <div class="linea completada"></div>

            <div class="paso completado">
                <span>✓</span>
            </div>

        </div>


        <div class="confirmacion-final">

            <div class="icono-aprobado">
                ✓
            </div>


            <h1>
                ¡Solicitud confirmada!
            </h1>


            <p class="mensaje-aprobado">
                Tu préstamo ha sido registrado correctamente.
            </p>


            <div class="datos-finales">

                <p>
                    <strong>DNI:</strong>
                    ${datosSolicitud.dni}
                </p>


                <p>
                    <strong>Celular:</strong>
                    ${datosSolicitud.celular}
                </p>


                <p>
                    <strong>Monto:</strong>
                    ${formatoSoles(datosSolicitud.monto)}
                </p>


                <p>
                    <strong>Cuotas:</strong>
                    ${datosSolicitud.meses}
                </p>


                <p>
                    <strong>Cuota mensual:</strong>
                    ${formatoSoles(plan.cuota)}
                </p>


                <p>
                    <strong>Pago total:</strong>
                    ${formatoSoles(plan.total)}
                </p>

            </div>


            <button
                id="btnWhatsApp"
                class="btn-empezar"
                type="button"
            >
            confirmar 
            </button>

        </div>

    `;


    const btnWhatsApp =
        document.getElementById("btnWhatsApp");


    btnWhatsApp.addEventListener(
        "click",
        enviarWhatsApp
    );

}


/* =========================================================
            ENVIAR DATOS POR WHATSAPP
========================================================= */

function enviarWhatsApp() {

    const numeroDestino = "51980524447";


    const plan =
        datosSolicitud.planElegido;


    const mensaje =

        "Hola, quiero confirmar mi préstamo.%0A%0A" +

        "DNI: " +
        datosSolicitud.dni +

        "%0A" +

        "Celular: " +
        datosSolicitud.celular +

        "%0A" +

        "Monto: " +
        formatoSoles(datosSolicitud.monto) +

        "%0A" +

        "Cuotas: " +
        datosSolicitud.meses +

        "%0A" +

        "Cuota mensual: " +
        formatoSoles(plan.cuota) +

        "%0A" +

        "Pago total: " +
        formatoSoles(plan.total);


    const url =
        "https://wa.me/" +
        numeroDestino +
        "?text=" +
        mensaje;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
                    INICIALIZACIÓN
========================================================= */

ocultarLoader();

mostrarPantalla(pantalla1);

validarDNI();

validarFormulario();
const manejarCookies = {
    setCookie: (name, value, days) => {
        let expires = '';
        if(days) {
            const date = new Date();
            date.setTime(date.getTime() + days *24*60*60*1000);
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = `${name}=${value || ''}${expires}; path=/`
    },
    getCookie: name => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1,c.length);
            if(c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00UTC; path=/;`;
    },
};

let intentos = parseInt(manejarCookies.getCookie('intentos')) || 3
const contrasenaInput = document.getElementById("text");
const boton = document.getElementById("boton");

boton.addEventListener('click', () => {
    if(contrasenaInput.value === "" ) {
        alert("no has escrito una contrasena")
    }
    else {
        if (intentos <= 0) {
            manejarCookies.setCookie("intentos", 0, 5);
            alert("no tienes intentos restantes");
            alert("vuelve en 5 dias o contacta al administrador");
        }
        else {
            const contrasena = contrasenaInput.value;
            if(contrasena === "ruan_3") {
                manejarCookies.setCookie("ruan_3", 'remove_the_3_letter_of_your_name', 900);
                window.location.href = "index2.html";
            }
            else {
                intentos--;
                manejarCookies.setCookie("intentos", intentos, 5);
                alert(`te quedan ${intentos} intentos`)
            }
        }
    }
})
addEventListener("keydown", function(event) {
    if(event.shiftKey&&event.ctrlKey) {
        manejarCookies.eraseCookie("intentos")
    }
})

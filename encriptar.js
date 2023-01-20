
window.onload = function (){
    /* Hacemos que al cargar la ventana obtenga los elementos de los botones */
    let encrypt_btn = document.getElementById("encriptar")
    let decrypt_btn = document.getElementById("desencriptar")
    let copy_btn = document.getElementById("copiar")
    encrypt_btn.onclick = encrypt_data
    decrypt_btn.onclick = decrypt_data
    copy_btn.onclick = copy_to_clipboard
    clean_textareas("texto-encriptar")
    clean_textareas("texto-desencriptar")
}


function copy_to_clipboard(){
    let textarea = document.getElementById("texto-desencriptar")
    textarea.select();
    document.execCommand("copy")
}

function get_data() {
    /* Funcion que se encarga de obtener el texto de los elementos textarea de encriptacion */
    let textarea = document.getElementById("texto-encriptar"); // obtiene el elemento textarea
    let text = textarea.value; // obtiene el texto del text area
    return text.trim()
}


function get_data_to_decrypt() {
    /* Funcion que se encarga de obtener el texto de los elementos textarea de desencriptacion */
    let textarea = document.getElementById("texto-encriptar"); // obtiene el elemento textarea
    let text = textarea.value; //obtiene el texto del textarea
    
    return text.trim() //retorna el texto sin espacios antes y despues
    //alert(text);
}


function clean_textareas(id_text_area) {
    let textarea = document.getElementById(id_text_area);
    textarea.value = ""
}


function remove_background(query_selector){
    let textarea = document.querySelector(query_selector);
    textarea.backgroundImage = "none";
}

function encrypt() {
    
    let text = get_data() //obtenemos palabra a encriptar
    
    let encrypted = "" //variable que guardara la palabra encriptada
    const KEYS = Object.keys(replacement) //las palabras pivote para reemplazar
    let idxs = {} //diccionario donde guardaremos el índice donde se sustituira la palabra

    for (let i = 0; i < KEYS.length; i++) { //recorremos las palabras pivote

        let start_idx = 0
        
        while (true) {
            
            let idx = text.indexOf(KEYS[i], start_idx) // el indice donde estpa el match con la palabra pivote para
                                                        // hacer el cambio
           
            idxs[idx] = KEYS[i] //agregamos el indice encontrado al diccionario
            start_idx = KEYS[i].length + idx // inidicamos ahora el nuevo índice a partir del cual iniciará la
                                            // busqueda del siguiente match
            
            // si ya no encuentra match o el indice es mayor a la longitud de la palabra se termina
            // e iniciaa buscar la siguiente palabra pivote
            if ((idx == -1) || (start_idx >= text.length)){
                break
            }
        }
        
    }

    // ahora recorremos la palabra para hacer el cambio en los indices que encontramos
    for (let i = 0; i< text.length; i++){
        // si el indice está en el diccionario hacemos el cambio
        if (i in idxs) {
            // guardamos la longitud de la palabra que se va a modificar para iniciar a partir
            // de la siguiente letra
            long = idxs[i].length
            // igualamos la palabra encriptada con el valor anteior
            encrypted = encrypted + replacement[idxs[i]]
            // ahora aumentamos el ínfice en una cantidad igual a la longitud de la palabra insertada
            // menos 1 porque el for aún va hacer un incremento
            i = i + long - 1

        } else {
            
            // si el indice no esta en el diccionari solo agregamos la letra del texto al texto
            // encriptado
            encrypted = encrypted + text[i]
        }
        
    }
    //alert(encrypted)
    return encrypted
}


function decrypt() {
    /* Funcion que se encarga de desencriptar la data, sigue la misma logica que la encriptacion
       con la diferencia que el diccionario a usar ahora tiene las llaves como valor y viceversa */
    let text = get_data()
   
    if (text.length == 0) {
        return false
    }

    let decrypted = ""
    const KEYS = Object.keys(decrypt_replace)
    let idxs = {}
    
    /** Obtenemos el índice donde se encuentra la palabra a sustituir y creamos un diccionario
     *  donde tendremos como llave el índice donde se encuentra la palabra y como valor
     *  la llave del diccionario decrypt_replace que luego usaremos para obtener el valor a 
     *   sustiruir para desencriptar
     *  Para esto usaremos el método indexOf de los objetos string que va así
     *  texto.indexOf("<texto buscar dentro del texto>",<opcionak: indice de inicio>)
     *  Si a este método no le colocamos el indice de inicio, solo nos retornará la primer coincidencia
     *  Cuando ya no encuentre más coincidencias retorna -1 o el indicie inicial sea mayor a la longitud
     *  de la palabra
     * 
     *  Luego, tenemos que saber qué palabras del diccionario "decrypt_replace" se encuentran en el
     *  texto a desencriptar. Por lo tanto debemos recorrer el texto para cada llave dentro del diccionario
     * 
     *  Entonces necesitamos un for que recorra todas las llaves del diccionario y, a su vez, un while que
     *  busque por las coincidencias de la palabra
     *  Si encuentra coincidencia, sumaremos al indicie inicial la longitud de a
    */
    
    for (let i = 0; i < KEYS.length; i++) {

        let start_idx = 0
        
        while (true) {
            
            let idx = text.indexOf(KEYS[i], start_idx)
           
            idxs[idx] = KEYS[i]
            start_idx = KEYS[i].length + idx
            

            if ((idx == -1) || (start_idx >= text.length)){
                break
            }
        }
        
    }

    /** Recorremos todo el texto a desencriptar
     *  Recordando que en idxs tenemos los índices donde inician las palabras que se van sustituir
     *  Entonces, recorremos el texto por su indice y cuando encontremos un indice que esta guardado en idxs
     *  obtenemos la longitud de la palabra a sustituir
     *  vamos creando la palabra desencriptada mediante la concatenacion del ultimo dato desencriptado
     *     más la palabara a desencriptar que, en este caso, es la obtenida del diccionario decrypt_replace
     *     usando como llave el valor obtenido de idxs
     *  Luego, como estamos posicionados en la primer letra de la palabra a quitar, si no movemos el valor de
     *      i y el índice no está en idxs nos copiará una letra que no corresponde, por este motivo debemos aumentar
     *     el valor de i en una cantidad igual a longitud de la palabra a sustituir -1. -1 porque aún falta que el for
     *     incremente en 1 a i.
     *  Si el índice no está en idxs simplemente pasa la letra a la palabra desencriptada
     */
    //console.log(idxs)
    for (let i = 0; i< text.length; i++){
        //console.log("i = " + i)
        if (i in idxs) {
            //console.log("Se sustituye " + idxs[i])
            long = idxs[i].length
            decrypted = decrypted + decrypt_replace[idxs[i]]
            //console.log(decrypted)
            // Como la palabra puede ser de más de 1 letra, obtenemos la longitud de lo que se sustituyo
            // Esto se lo sumamos a i para que nos salte la palabra que acabamos de sustituir, como estamos en
            // la primera y aún se va a aumentar 1, le sumaremos a i, la longitud de la palabra -1
            i = i + long - 1

        } else {
            //console.log("Se conserva " + text[i])
            decrypted = decrypted + text[i]
        }
        //console.log(decrypted)
    }
    //alert(decrypted)
    return decrypted
}

function desencriptar_style(element){
    let text_area = document.querySelector(".aside textarea");
    let button = document.querySelector(".aside button");
    text_area.style.backgroundImage = "none";
    text_area.value = data_encrypted;
    text_area.style.backgroundColor = "white";
    text_area.style.border = "none";
    text_area.style.borderRadius = "36px";
    button.style.visibility = "visible"
}


function encrypt_data(){
    data_encrypted = encrypt();
    if (data_encrypted == false) {
        alert("No escribiste nada")
        return
    }
    
    desencriptar_style();
    let text_area = document.querySelector(".aside textarea");
    text_area.value = data_encrypted;
}


function decrypt_data(){
    data_decrypted = decrypt();
    let text_area = document.querySelector(".aside textarea");
    text_area.value = data_decrypted;
}

/* Variable que almacena la info para sustituir y encriptar */
const replacement = {
    "e": "enter",
    "i": "imes",
    "a": "ai",
    "o": "ober",
    "u": "ufat"
}

const decrypt_replace = {
    "enter": "e",
    "imes": "i",
    "ai": "a",
    "ober": "o",
    "ufat": "u"
}



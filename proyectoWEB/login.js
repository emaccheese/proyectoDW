window.onload=init;


var usuarioInput;
var contraInput;
var warningDiv;
function init(){
    var boton1 = document.getElementById("login");
    boton1.onclick = logear;
    usuarioInput = document.getElementById("user");
    contraInput = document.getElementById("pass");
    warningDiv = document.getElementById("warning");
}

function logear(){
    var url = "http://proyectodaw.atwebpages.com/login.php?usuario=";
    var usuario = usuarioInput.value;
    var contra = contraInput.value;

      url = url+usuario + "&contrasena=" + contra;
      console.log(url);
      var request= new XMLHttpRequest();
      request.open("GET",url);
      request.onload= function()
      {
          if(request.status == 200)
              procesar(request.responseText);
      };
      request.send(null);
    

}

function procesar(respuesta){
    var arr= new Array();

    arr=JSON.parse(respuesta).resultado;
    console.log(arr);
    if(arr=="exito"){
            window.location.href = "inicio.html"
    }
    else{
            usuarioInput.value = "";
            contraInput.value = "";
            warningDiv.innerHTML = "<div class='alert alert-warning' role='alert'>La informacion que ingresaste es incorrecta. Intenta de nuevo o registrate.</div>";
    }

}

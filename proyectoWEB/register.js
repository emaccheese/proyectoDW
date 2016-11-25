window.onload=init;


var usuario;
var contra;
var recontra;
var warningDiv;

function init(){
    var boton1 = document.getElementById("register");
    document.getElementById("confpass").onchange = checkPass;
    boton1.onclick = registrar;
    warningDiv = document.getElementById("warning");

}

function checkPass(){
  if(document.getElementById("confpass").value != document.getElementById("pass").value ){
    console.log("try again");
    document.getElementById("warning").innerHTML = "<div class='alert alert-warning' role='alert'>Las Contrasenas no son iguales.</div>";
  }else{
    document.getElementById("warning").innerHTML = "";

  }
}
function registrar(){
    var url = "http://proyectodaw.atwebpages.com/register.php?usuario=";
    usuario = document.getElementById("user").value;

    contra = document.getElementById("pass").value;
    recontra = document.getElementById("confpass").value;

    if(contra == recontra){
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
            document.getElementById("warning").innerHTML = "";
    }
    else{
      warningDiv.innerHTML = "<div class='alert alert-warning' role='alert'>Las contrasenas no son iguales.</div>"
      console.log("diferentes contras");
    }

}

function procesar(respuesta){
   var arr= new Array();

    arr=JSON.parse(respuesta).resultado;
    if(arr=="error"){
            console.log("1");
            usuario = "";
            warningDiv.innerHTML = "<div class='alert alert-warning' role='alert'>El usuario que ingresaste ya existe, intenta otro</div>";
    }
    else{
            console.log("2");
            window.location.href = "login.html"
    }

}

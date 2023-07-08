


async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    let resp = await fetch("/login", {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
        body: JSON.stringify({credentials: response.credential})
    });
    if(resp.ok === true)
    {
        const data = await resp.json();
        const username  = data.username;
        let date = new Date();
        let expiresTime = date.getTime()+1000*3600;
        date.setTime(expiresTime);
        let encodedUserName = bytesToBase64(new TextEncoder().encode(username));
        alert(username);
        // alert(new TextDecoder().decode(base64ToBytes(encodedUserName)));
        document.cookie = `username=${encodeURIComponent(encodedUserName)};expires=${date.toUTCString()};path=/`;
        //document.cookie = `username=${encodeURIComponent(username)};expires=${date.toUTCString()};path=/`;
        //document.cookie = `username=${encodeURIComponent("Serhii Ruban")};expires=${date.toUTCString()};path=/`;
        console.log(username);
        let buttonDiv = document.getElementById("buttonDiv");
        let userNameDiv = document.getElementById("userNameDiv");
        let signoutDiv = document.getElementById("signoutDiv");
        userNameDiv.innerText = username;
        buttonDiv.style.display = "none";
        signoutDiv.style.display = "block";
        window.location = document.URL;
    }

  }
  window.onload = function () {
    google.accounts.id.initialize({
      client_id: "412761115472-jdihj440pgr6j594hq9g4kf4vaa2ave2.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
  
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "small", text: "signin"}  // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }

function signOut(){
    let buttonDiv = document.getElementById("buttonDiv");
        let userNameDiv = document.getElementById("userNameDiv");
        let signoutDiv = document.getElementById("signoutDiv");
        let date = new Date();
        let expiresTime = date.getTime()-1000;
        date.setTime(expiresTime);
        document.cookie = `username=;expires=${date.toUTCString()};path=/`;
        userNameDiv.innerText ="";
        buttonDiv.style.display = "block";
        signoutDiv.style.display = "none";
        window.location = document.URL;
  }

  function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }
  document.addEventListener("DOMContentLoaded", ()=>{
    let buttonDiv = document.getElementById("buttonDiv");
    let userNameDiv = document.getElementById("userNameDiv");
    let signoutDiv = document.getElementById("signoutDiv");
    let username =getCookie("username");
    
    // if(username){
    if(username){
      username = new TextDecoder().decode(base64ToBytes(username))
    console.log(username);
    buttonDiv.style.display = "none";
    signoutDiv.style.display = "block";
    userNameDiv.innerText = username;
    }
    else{
        userNameDiv.innerText ="";
        buttonDiv.style.display = "block";
        signoutDiv.style.display = "none";
    }
  }); 


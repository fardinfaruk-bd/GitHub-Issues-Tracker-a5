document.getElementById('signin-btn').addEventListener('click', function(){
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if(user == "admin" && pass == "admin123"){
        alert('Sign In Successful')
        window.location.assign("./home.html")
    }else{
        alert('Wrong username or password')
        return;
    }
} )
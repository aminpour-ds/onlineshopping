window.onload = selected_items();


function getCookie(name){
    var pattern = RegExp(name + "=.[^;]*");
    var matched = document.cookie.match(pattern);
    if(matched){
        var cookie = matched[0].split('=');
        return cookie[1];
    }
    return false;
}


function set_cart_id(){
    fetch('/api/carts/', {
        method: 'POST',
        headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        },                
    })
    .then((res) => {
        if (res.status == 201) {
            return res.json();
        } else {
            throw Error(res.statusText);
        }
    })
    .then(data => {            
        var d = new Date();
        exp_days=30;
        d.setTime(d.getTime() + (exp_days*24*60*60*1000));
        var expires = "expires=" + d.toGMTString();     
        document.cookie = "cart_id=" + data.id + ";" + expires + ";path=/";
    })
    .catch((err) => {                    
        console.log(err);
    });
}


function selected_items() {
    let cart_id = getCookie("cart_id");
    
    if (!cart_id) {    // if cart_id doesn't exist then create it and save it in cookie
        set_cart_id();                
    }
}


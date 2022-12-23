window.onload = selected_items();
const badge_element = document.getElementById("badge");
const cart_list_image = document.getElementById("cart-list-image");
const cart_list_title = document.getElementById("cart-list-title");
const cart_list_price = document.getElementById("cart-list-price");
const cart_item_container = document.getElementById("cart-item-container");
const cart_item_url = document.getElementById("cart-item-url");



function block(item){
    return '<li><a class="photo" href="/services/' + item.product.id + '"><img class="cart-thumb" alt="" src="' + item.product.images[0].image + '"/></a>' + 
           '<h6><a href="/services/' + item.product.id + '">' + item.product.title + '</a></h6>' + 
           '<p">' + item.quantity + 'x - ' + '<span class="price">$' + item.product.price + '</span></p></li>';         
}              
              

function cart_list(result, cart_id){
    for (selitem=0; selitem<result.items.length; selitem++){
        cart_item_container.innerHTML += block(result.items[selitem]);      
    }     
    cart_item_container.innerHTML += '<li class="total"><a href="/cart/' + cart_id + '" class="btn btn-default hvr-hover btn-cart">VIEW CART</a>' + 
    '<span class="float-right" id="total-items-price"><strong>Total:</strong> $' + result.total_price + '</span></li>'
}


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


function get_cart_items(cart_id){              
    url = '/api/carts/' + cart_id + '/';    
    
    const items = fetch(url, {
        method: 'GET',
        headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",      
        },                
    })
    .then((res) => {
        if (res.status == 200) {
            return res.json();
        } else {
            throw Error(res.statusText);
        }
    })
    .catch((err) => {                    
        console.log(err);
    });

    const ret_items = async () => {
        const a = await items;
        return a;
    };
    
    ret_items().then(function(result) {
        badge_element.innerHTML = result.items.length;     
        cart_list(result, cart_id);
    });
}


function selected_items() {
    let cart_id = getCookie("cart_id");
    
    if (!cart_id) {    // if cart_id doesn't exist then create it and save it in cookie
        set_cart_id();                
    } else {           // if cart_id exists then return the cart_items
        get_cart_items(cart_id);
    }
}


function delete_cart_item(item_id){   
    let cart_id = getCookie("cart_id");           
    url = '/api/carts/' + cart_id + '/items/' + item_id;    
    
    let deleteItem = fetch(url, {
        method: 'DELETE',
        headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",          
        },                
    })
    .then((res) => {
        if (res.status != 204) {
            throw Error(res.statusText);
        }
    })
    .catch((err) => {                    
        console.log(err);
    });

    const page = async () => {
        const a = await deleteItem;
        return a;
    };
    
    page().then(function(result) {
        location.reload();
    });
}


function update_cart(items){
    let cart_id = getCookie("cart_id");     
    url = '/api/carts/' + cart_id + '/items/';   
    
    const item = {
        input_quantity : document.querySelector("#Inputquantity"),
        product_id : items.product.id       
    };                          
    addEventListener("click", async (e) => {                
        e.preventDefault();
  
        await fetch(url, {
            method: 'POST',
            headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                quantity: item.input_quantity.value,
                product_id: item.product_id.value
            }),                
        })
        .then((res) => {
            if (res.status == 201) {
                window.location.assign("/");
            } else {
                throw Error(res.statusText);
            }
        })
        .catch((err) => {                    
            console.log(err);
            alert('Input values are incorrect, try again!');
        });
    });
}

// save the token that comming from server in SessionStorage of browser:
function saveToken() {
    const userinfo = {
        input_username : document.querySelector("#InputUsername"),
        input_password : document.querySelector("#InputPassword")            
    };                          
    addEventListener("click", async (e) => {                
        e.preventDefault();
  
        await fetch('/auth/jwt/create/', {
            method: 'POST',
            headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            username: userinfo.input_username.value,
            password: userinfo.input_password.value
            }),                
        })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            } else {
                throw Error(res.statusText);
            }
        })
        .then(data => {
            sessionStorage.setItem("token", data.access);  
            sessionStorage.setItem("refresh", data.refresh); 
            window.location.assign("/");
        })
        .catch((err) => {                    
            console.log(err);
            alert('User Name and Password are incorrect, try again!');
        });
    });            
}


// delete the token from SessionStorage of browser for logout:
function deleteToken() {      
    if (sessionStorage.token) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("refresh");
        window.location.assign("/");
    };
}
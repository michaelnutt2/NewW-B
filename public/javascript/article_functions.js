function favorite(id) {
    var btn = document.getElementById(id);
    if(btn.innerHTML === "Favorite") {
        var article = '/user/favorited/' + id;
        fetch(article, {method: 'POST'})
        .then(function(response){
            if(response.ok) {
                console.log("Favorited!");
                btn.classList.remove("btn-success");
                btn.classList.add("btn-danger");
                btn.innerHTML = "Unfavorite";
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        });
    } else {
        var article = '/user/unfavorited/' + id;
        fetch(article, {method: 'POST'})
        .then(function(response) {
            if(response.ok) {
                console.log("Unfavorited!");
                btn.classList.remove("btn-danger");
                btn.classList.add("btn-success");
                btn.innerHTML = "Favorite";
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        });
    }
}
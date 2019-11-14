function favorite(favorited, id) {
    console.log(favorited);
    console.log(id);
    var article = '/user/favorites/' + id;
    if(favorited) {
        article += '/favorited';
        console.log(article);
        fetch(article, {method: 'POST'})
        .then(function(response){
            if(response.ok) {
                console.log("Favorited!");
                return;
            }
            throw new Error('Request failed.');
        })
        .catch(function(error) {
            console.log(error);
        });
    }
}
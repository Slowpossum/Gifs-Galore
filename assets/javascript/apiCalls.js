var tags = JSON.parse(localStorage.getItem("tags")) || ["cat", "dog", "fish", "bird", "anime", "meme", "art"];
var favorites = JSON.parse(localStorage.getItem("favorites")) || {
    length: 0,
    list: []
};
var images = {
    list: []
};
var imagePosition = 0;


tags.forEach(tag => {
    createTag(tag);
});

if (favorites.length > 0) {
    favorites[list].forEach(favorite => {
        createFavorite(favorite);
    });
}

$(".tag").on("click", function () {
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + $(this).val() + "&api_key=i3NTmSSVlFnAIZobSeDS4cGEcGvTjI1T&limit=5"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            images[response.data[i].title] = {
                title: response.data[i].title,
                rating: response.data[i].rating,
                original: response.data[i].images.original.url,
                still: response.data[i].images.original_still.url,
                favorited: false
            };

            images.list.push(response.data[i].title);
        }

        updateImages();
    });
});


//
//
//  FUNCTIONS
//
//
function createTag(tag) {
    var btn = $('<button class="tag">').text(tag);
    btn.attr("value", tag);

    $("#tagsDiv").append(btn);
}

function createFavorite(favorite) {
    var btn = $('<button class="tag"').text("placeholder"); //fix this
}

function updateImages () {
    // var size = 100;
    // var opacity = 1;
    // var position = 6.25;
    // var zIndex;
    var size, opacity, position, zIndex;

    var loop = 0;

    $("#images").empty();

    for (var i = imagePosition - 2; i <= imagePosition + 2; i++) {
        size = 100 - Math.abs(i - imagePosition) * 25;
        opacity = 1 - Math.abs(i - imagePosition) * .25;
        position = 6.25 * Math.pow(2, loop);
        zIndex = -Math.abs(i - imagePosition);

        if (i >= 0) {
            if(loop !== 5) {
                placeImage(images[images.list[i]].original, size, opacity, position, zIndex);
            } else {
                placeImage(images[images.list[i]].original, size, opacity, position, zIndex);
            }
            
        }

        loop++;
    }
}

function placeImage (src, size, opacity, position, z) {
    var img = $("<img>");
    img.attr("src", src);
    img.css({"height": size + "%", "opacity": opacity, "position": "absolute", "left": position + "%", "z-index": z});

    $("#images").append(img);
}

// API key: i3NTmSSVlFnAIZobSeDS4cGEcGvTjI1T

12.5
6.25
var tags = JSON.parse(localStorage.getItem("tags")) || ["opossum", "cat", "dog", "fish", "bird", "anime", "meme", "art"];
var favorites = JSON.parse(localStorage.getItem("favorites")) || {
    length: 0,
    list: []
};
var images = {
    offset: {},
    list: []
};
var imagePosition = "empty";



tags.forEach(tag => {
    createTag(tag);
});

if (favorites.length > 0) {
    favorites.list.forEach(favorite => {
        createFavorite(favorites[favorite]);
    });
}

$("#tagsDiv").on("click", ".tag", function () {
    var tag = $(this).val();
    if (images.offset[tag] === undefined) {
        images.offset[tag] = 0;
    }

    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + tag + "&offset=" + images.offset[tag] + "&api_key=i3NTmSSVlFnAIZobSeDS4cGEcGvTjI1T&limit=5"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            images[response.data[i].images.original.url] = {
                title: response.data[i].title,
                rating: response.data[i].rating,
                original: response.data[i].images.original.url,
                still: response.data[i].images.original_still.url
            };

            images.list.push(response.data[i].images.original.url);
        }

        images.offset[tag] += 5;

        updateImages();
    });
});

$("#favoritesDiv").on("click", ".favorite", function () {
    // images.list.push($(this).val());
    if (images.hasOwnProperty($(this).val())) {
        imagePosition = images.list.indexOf($(this).val());
        updateImages();
    } else {
        images.list.push($(this).val());
        images[$(this).val()] = favorites[$(this).val()];
        imagePosition = images.list.length - 1;
        updateImages();
    }
});



//
//
//  FUNCTIONS
//
//
function createTag(tag) {
    var btn = $('<button>').text(tag);
    btn.attr("value", tag);
    btn.attr("class", "tag");

    $("#tagsDiv").append(btn);
}

function createFavorite(favorite) {
    var btn = $('<button>').text(favorite.title);
    btn.attr("value", favorite.original);
    btn.attr("class", "favorite");

    $("#favoritesDiv").append(btn);
}

function updateImages() {
    if (imagePosition === "empty") {
        imagePosition = 0;
        $("#arrowRight").toggleClass("hide");
    } else {
        if (imagePosition > 0 && $("#arrowLeft").hasClass("hide")) {
            $("#arrowLeft").toggleClass("hide");
        } else if (imagePosition === 0 && !$("#arrowLeft").hasClass("hide")) {
            $("#arrowLeft").toggleClass("hide");
        }

        if (imagePosition < images.list.length - 1 && $("#arrowRight").hasClass("hide")) {
            $("#arrowRight").toggleClass("hide");
        } else if (imagePosition === images.list.length - 1 && !$("#arrowRight").hasClass("hide")) {
            $("#arrowRight").toggleClass("hide");
        }
    }

    var currentImage = images[images.list[imagePosition]];

    if (favorites.list.indexOf(currentImage.original) !== -1) {
        $("#likeBtn").attr("class", "fa-2x fas fa-heart")
    } else {
        $("#likeBtn").attr("class", "fa-2x far fa-heart")
    }


    var img = $("<img>");

    img.attr("src", images[images.list[imagePosition]].original);

    $("#images").empty();
    $("#images").append(img);
    updateInfo();
}

function updateInfo() {
    var title = $("<p>");
    var rating = $("<p>");
    var original = $("<p>");
    var originalLink = $("<a>");

    if (imagePosition !== "empty") {
        originalLink.attr("href", images[images.list[imagePosition]].original);
        originalLink.attr("target", "blank_");
        originalLink.text(images[images.list[imagePosition]].original);

        title.append("<b>Title:</b> " + images[images.list[imagePosition]].title);
        rating.append("<b>Rating:</b> " + images[images.list[imagePosition]].rating)
        original.append("<b>Original:</b> ");
        original.append(originalLink);
    } else {
        title.append("<b>Title: </b>");
        rating.append("<b>Rating: </b>");
        original.append("<b>Original: </b>");
    }

    $("#imageInfo div").empty();

    $("#imageInfo div").append(title);
    $("#imageInfo div").append(rating);
    $("#imageInfo div").append(original);
}

// API key: i3NTmSSVlFnAIZobSeDS4cGEcGvTjI1T
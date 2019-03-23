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

//On click event for tags within the tag div element on in the top bar. When a tag is clicked a query is made to the gify API,
//which returns 5 images of the tag, adds them to the image object by URL along with relevant meta data, adds them to the image list,
//and finally appends them to the list of images in the image frame before updating the frame.
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

//On click event for favorites div. Checks if the clicked button is within the current set of images, and if it is sets the imagePosition
//value equal to its location, and updates the image container to show the image. If it is not, then it appends it onto the end of the images
//object along with any relevant information contained within favorites, sets the imagePosition to the location of the new image, and updates
//the image container.
$("#favoritesDiv").on("click", ".favorite", function () {
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
//Creates a new tag button and appends it to the tags div.
function createTag(tag) {
    var btn = $('<button>').text(tag);
    btn.attr("value", tag);
    btn.attr("class", "tag");

    $("#tagsDiv").append(btn);
}

//Creates a new favorite button and appends it to the favorites div.
function createFavorite(favorite) {
    var btn = $('<button>').text(favorite.title);
    btn.attr("value", favorite.original);
    btn.attr("class", "favorite");

    $("#favoritesDiv").append(btn);
}

//Updates image along with arrows to shift through the image list to reflect the position within the list. Also
//sets state of favorite heart depending on if current image is within favorites list, and finally runs function
//to update info pane.
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

//Updates info pane to reflect relevent meta data from current image.
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
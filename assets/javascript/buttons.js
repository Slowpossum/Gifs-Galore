var tagsScroll = 0;
var favsScroll = 0;

//Button to expand/retract top bar holding the tags div and favorites div.
$("header .fa-grip-lines").on("click", function () {
    if ($("#tagsHolder").is(":visible")) {
        $("#tagsHolder").animate({ width: "toggle" }, 250);
    }
    if ($("#favoritesDiv").is(":visible")) {
        $("#favoritesDiv").animate({ width: "toggle" }, 250);
    }
    if ($("#addForm").is(":visible")) {
        $("#addForm").animate({ width: "toggle" }, 250);
    }
    if ($("#deleteForm").is(":visible")) {
        $("#deleteForm").animate({ width: "toggle" }, 250);
    }

    clearInputs();

    $("#topBar").slideToggle(250);
});

//Button to expand/retract image info pane.
$("#imageInfo .fa-grip-lines").on("click", function () {
    $("#imageInfo div").slideToggle(250);
});

//Button to expand/retract tags div. Also retracts favorites div if it is open.
$("#tagsBtn").on("click", function () {
    if ($("#favoritesDiv").is(":visible")) {
        $("#favoritesDiv").animate({ width: "toggle" }, 250);
    }
    if ($("#addForm").is(":visible")) {
        $("#addForm").animate({ width: "toggle" }, 250);
    }
    if ($("#deleteForm").is(":visible")) {
        $("#deleteForm").animate({ width: "toggle" }, 250);
    }

    clearInputs();

    $("#tagsHolder").animate({ width: 'toggle' }, 250);
});

//Button to expand/retract favorites div. Also retracts tags div if it is open.
$("#favoritesBtn").on("click", function () {
    if ($("#tagsDiv").is(":visible")) {
        $("#tagsHolder").animate({ width: 'toggle' }, 250);
    }
    if ($("#addForm").is(":visible")) {
        $("#addForm").animate({ width: "toggle" }, 250);
    }
    if ($("#deleteForm").is(":visible")) {
        $("#deleteForm").animate({ width: "toggle" }, 250);
    }

    clearInputs();

    $("#favoritesDiv").animate({ width: 'toggle' }, 250);
});

//Function to scroll tags div if it is overfull. Basically, sets position of initial click using event handler of tagsDiv,
//then creates event handler for document to update on mouse movement and stores position in currPos. Following that an interval is
//set to check the current position of the mouse versus the initial position. If current > initial, it scrolls to the right, else it scrolls
//to the left. During the interval a mouseup function is set on the document which clears the interval and unbinds the previous mousemove
//event, allowing for the clutter to be cleaned up after the function completes fully.
$("#tagsDiv").mousedown(function (e) {
    if (parseInt($("#tagsDiv").css("width")) === parseInt($("#tagsDiv").css("max-width"))) {
        var initialPos = e.clientX;
        var maxWidth = $("#tagsDiv")[0].scrollWidth - 405;
        var currPos;
        var mouseInterval;

        $(document).mousemove(function (f) {
            currPos = f.clientX;
        });

        mouseInterval = setInterval(function () {
            if (currPos > initialPos) {
                if (tagsScroll + 5 <= maxWidth) {
                    tagsScroll += 5;
                }
                $("#tagsDiv").scrollLeft(tagsScroll);
            } else if (currPos < initialPos) {
                if (tagsScroll - 5 >= 0) {
                    tagsScroll -= 5;
                }
                $("#tagsDiv").scrollLeft(tagsScroll);
            }
        }, 20);

        $(document).mouseup(function () {
            clearInterval(mouseInterval);
            $(document).unbind("mousemove");
        });
    }
});

//Does the same as previous function, but for favorites.
$("#favoritesDiv").mousedown(function (e) {
    if (parseInt($("#favoritesDiv").css("width")) === parseInt($("#favoritesDiv").css("max-width"))) {
        var initialPos = e.clientX;
        var maxWidth = $("#favoritesDiv")[0].scrollWidth - 405;
        var currPos;
        var mouseInterval;

        $(document).mousemove(function (f) {
            currPos = f.clientX;
        });

        mouseInterval = setInterval(function () {
            if (currPos > initialPos) {
                if (favsScroll + 5 <= maxWidth) {
                    favsScroll += 5;
                }
                $("#favoritesDiv").scrollLeft(favsScroll);
            } else if (currPos < initialPos) {
                if (favsScroll - 5 >= 0) {
                    favsScroll -= 5;
                }
                $("#favoritesDiv").scrollLeft(favsScroll);
            }
        }, 20);

        $(document).mouseup(function () {
            clearInterval(mouseInterval);
            $(document).unbind("mousemove");
        });
    }
});

//Moves imagePosition one position to left and updates image
$("#arrowLeft").on("click", function () {
    if (imagePosition > 0) {
        imagePosition--;
    }

    updateImages();
});

//Moves imagePosition one position to left and updates image
$("#arrowRight").on("click", function () {
    if (imagePosition < images.list.length - 1) {
        imagePosition++;
    }

    updateImages();
});

//Adds/removes current image from favorites. If there are images currently loaded, it checks whether the current image is
//within favorites already. If it is, then it removes the corresponding button, decreases the length of favorites, removes
//the image from the favorites object, removes it from the list within favorites, updates the local storage to reflect the change,
//and switches the favorites heart to be unfavorited. If it is not within favorites already, it does the opposite.
$("#likeBtn").on("click", function () {
    var currentImage = images[images.list[imagePosition]];

    if (imagePosition !== "empty") {
        if (favorites[currentImage.original] === undefined) {
            favorites.length++;
            favorites.list.push(currentImage.original);
            favorites[currentImage.original] = currentImage;

            createFavorite(favorites[currentImage.original]);

            localStorage.setItem("favorites", JSON.stringify(favorites));

            $("#likeBtn").attr("class", "fa-2x fas fa-heart");
        } else {
            favorites.length--;

            $(`button[value="${currentImage.original}"]`).remove();

            delete favorites[currentImage.original];
            favorites.list.splice(favorites.list.indexOf(currentImage.original), 1);

            localStorage.setItem("favorites", JSON.stringify(favorites));

            $("#likeBtn").attr("class", "fa-2x far fa-heart");
        }
    }
});

//Button to show the input field to add tags.
$("#addBtn").on("click", function () {
    if ($("#deleteForm").is(":visible")) {
        $("#deleteForm").animate({ width: "toggle" }, 250);
    }

    clearInputs();
    $("#addForm").animate({ width: "toggle" }, 250);
});

//Button to show the input field to delete tags.
$("#deleteBtn").on("click", function () {
    if ($("#addForm").is(":visible")) {
        $("#addForm").animate({ width: "toggle" }, 250);
    }

    clearInputs();
    $("#deleteForm").animate({ width: "toggle" }, 250);
});

//On submit event for adding tags. When data is sent, if the data is non-empty, it creates a tag using the data, pushes
//the name of the tag to the list, empties the input field, and updates the local storage to reflect the new tag array.
$("#addForm").on("submit", function (e) {
    e.preventDefault();
    var tagToAdd = $("#addInput").val().trim();

    if ($("#addInput").val().trim() !== "") {
        createTag(tagToAdd);
        tags.push(tagToAdd);
        $("#addInput").val("");

        localStorage.setItem("tags", JSON.stringify(tags));
    }
});

//On submit even for deleting tags. Does the opposite of the previous.
$("#deleteForm").on("submit", function (e) {
    e.preventDefault();
    var tagToDelete = $("#deleteInput").val().trim();

    if ($("#deleteInput").val().trim() !== "" && tags.indexOf(tagToDelete) !== -1) {
        $(`button[value="${tagToDelete}"]`).remove();
        tags.splice(tags.indexOf(tagToDelete), 1);
        $("#deleteInput").val("");

        localStorage.setItem("tags", JSON.stringify(tags));
    }
});

//Clears all current images and resets all related variables.
$("#clearBtn").on("click", function () {
    $("#images").empty();
    images = {
        offset: {},
        list: []
    };
    imagePosition = "empty";

    updateInfo();

    if (!$("#arrowRight").hasClass("hide")) {
        $("#arrowRight").toggleClass("hide");
    }
    if (!$("#arrowLeft").hasClass("hide")) {
        $("#arrowLeft").toggleClass("hide");
    }
});

//Hover event for info in top left corner. Shows/hides info pane when "i" is hovered over.
$(".fa-info-circle").hover(function () {
    $("#infoPane").toggleClass("hide");
}, function () {
    $("#infoPane").toggleClass("hide");
});

//Function to clear inputs.
function clearInputs() {
    $("#addInput").val("");
    $("#deleteInput").val("");
}
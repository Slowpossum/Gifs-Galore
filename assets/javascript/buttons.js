var tagsScroll = 0;
var favsScroll = 0;

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

$("#imageInfo .fa-grip-lines").on("click", function () {
    $("#imageInfo div").slideToggle(250);
});

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

$("#arrowLeft").on("click", function () {
    if (imagePosition > 0) {
        imagePosition--;
    }

    updateImages();
});

$("#arrowRight").on("click", function () {
    if (imagePosition < images.list.length - 1) {
        imagePosition++;
    }

    updateImages();
});

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

$("#addBtn").on("click", function () {
    if ($("#deleteForm").is(":visible")) {
        $("#deleteForm").animate({ width: "toggle" }, 250);
    }

    clearInputs();
    $("#addForm").animate({ width: "toggle" }, 250);
});

$("#deleteBtn").on("click", function () {
    if ($("#addForm").is(":visible")) {
        $("#addForm").animate({ width: "toggle" }, 250);
    }

    clearInputs();
    $("#deleteForm").animate({ width: "toggle" }, 250);
});

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

function clearInputs() {
    $("#addInput").val("");
    $("#deleteInput").val("");
}
var tagsScroll = 0;
var favsScroll = 0;

$("header .fa-grip-lines").on("click", function () {
    $("#topBar").slideToggle(250);
});

$(".imageInfo .fa-grip-lines").on("click", function () {
    $(".imageInfo div").slideToggle(250);
});

$("#tagsBtn").on("click", function () {
    if ($("#favoritesDiv").is(":visible") === true) {
        $("#favoritesDiv").animate({ width: 'toggle' }, 250);
    }

    $("#tagsDiv").animate({ width: 'toggle' }, 1000);
});

$("#favoritesBtn").on("click", function () {
    if ($("#tagsDiv").is(":visible") === true) {
        $("#tagsDiv").animate({ width: 'toggle' }, 250);
    }

    $("#favoritesDiv").animate({ width: 'toggle' }, 250);
});

$("#tagsDiv").mousedown(function (e) {
    if (parseInt($("#tagsDiv").css("width")) === parseInt($("#tagsDiv").css("max-width"))) {
        var initialPos = e.clientX;
        var maxWidth = parseInt($("#tagsDiv").css("max-width"));
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
        var maxWidth = parseInt($("#favoritesDiv").css("max-width"));
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
                $("#tagsDiv").scrollLeft(favsScroll);
            } else if (currentPos < initilPos) {
                if (favsScroll - 5 >= 0) {
                    favsScroll -= 5;
                }
                $("#tagsDiv").scrollLeft(favsScroll);
            }
        }, 20);

        $(document).mouseup(function () {
            clearInterval(mouseInterval);
            $(document).unbind("mousemove");
        });
    }
});
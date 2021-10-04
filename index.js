$(document).ready(function () {
    const API_KEY = 'AIzaSyDB9zmVxxrEOVyUS73-zmoAt5StlCpHQn0';
    let video_id  = "";

    $('form').submit(function (e) {
        e.preventDefault();
        video_id = $('#video_url').val().split("=")[1];
        $("span").text("");

        if(video_id != ""){
            getDuration(video_id, API_KEY);
        }else{
            alert("Please enter a Youtube video ID");
        }
    });
});

function getDuration(video_id, api_key) {
    $.get(
        `https://www.googleapis.com/youtube/v3/videos?id=${video_id}&key=${api_key}&part=snippet,contentDetails`,
        function (data){
            if(data.pageInfo.totalResults > 0){
                let duration = convertTime(data.items[0].contentDetails.duration);
                $("span").text(duration);
            }
            else{
                alert("No result!");
            }
        }
    );
}

function convertTime(duration){
    let time = duration.match(/\d+/g);

    if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1){
        time = [0, time[0], 0];
    } 
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
        time = [time[0], 0, time[1]];
    }
    if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
        time = [time[0], 0, 0];
    }

    duration = 0;

    if (time.length == 3) {
        duration = duration + parseInt(time[0]) * 3600;
        duration = duration + parseInt(time[1]) * 60;
        duration = duration + parseInt(time[2]);
    }
    else if (time.length == 2) {
        duration = duration + parseInt(time[0]) * 60;
        duration = duration + parseInt(time[1]);
    }
    else if (time.length == 1) {
        duration = duration + parseInt(time[0]);
    }

    let hour = Math.floor(duration / 3600);
    let minute = Math.floor(duration % 3600 / 60);
    let second = Math.floor(duration % 3600 % 60);

    return ((hour > 0 ? (hour < 10 ? `0${hour}` : hour) + ":" + (minute < 10 ? "0" : "") : "") + minute + ":" + (second < 10 ? "0" : "") + second);
}

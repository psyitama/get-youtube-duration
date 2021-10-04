/** Functions related to Youtube video duration
*/
$(document).ready(function () {
    const API_KEY = ""; // Insert your Youtube API key here first
    let video_id  = "";

    $("form").submit(function (e) {
        e.preventDefault();
        video_id = getID($('#video_url').val());
        $("span").text("");

        if(video_id != ""){
            getDuration(video_id, API_KEY);
        }else{
            alert("Please enter a Youtube video ID");
        }
    });
});

/**
*   DOCU: Function that extract video ID of the Youtube URL
*   Last updated at: October 04, 2021
*   Requires: string
*   Author: Philip
*/
function getID(url){
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    
    return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
 }

 /**
*   DOCU: Function that get the unformatted duration of fetched Youtube video
*   Last updated at: October 04, 2021
*   Requires: extracted video_id and api_key in string format
*   Author: Psyrone
*/
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

/**
*   DOCU: Function that converts youtube duration into hh:mm:ss format
*   Last updated at: October 04, 2021
*   Requires: youtube duration raw data
*   Author: Psyrone
*/
function convertTime(duration){
    let time = duration.match(/\d+/g);

    /* Extracting hour, minute and second from the unformatted youtube duration */
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

    /* Check if the converted time contains hour, minute and second */
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

    /* Getting the right format for hour, minute and second using the duration value */
    let hour   = Math.floor(duration / 3600);
    let minute = Math.floor(duration % 3600 / 60);
    let second = Math.floor(duration % 3600 % 60);

    return ((hour > 0 ? (hour < 10 ? `0${hour}` : hour) + ":" + (minute < 10 ? "0" : "") : "") + minute + ":" + (second < 10 ? "0" : "") + second);
}

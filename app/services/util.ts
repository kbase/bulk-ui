const msecPerMinute = 1000 * 60;
const msecPerHour = this.msecPerMinute * 60;
const msecPerDay = this.msecPerHour * 24;
const dayOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
const months = ['Jan','Feb', 'March', 'April', 'May', 'June', 'July',
                'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];


export class Util {

    relativeTime(timestamp) : string {
        var date = new Date();

        var interval =  date.getTime() - timestamp;

        var days = Math.floor(interval / msecPerDay );
        interval = interval - (days * msecPerDay);

        var hours = Math.floor(interval / msecPerHour);
        interval = interval - (hours * msecPerHour);

        var minutes = Math.floor(interval / msecPerMinute);
        interval = interval - (minutes * msecPerMinute);

        var seconds = Math.floor(interval / 1000);

        if (days == 0 && hours == 0 && minutes == 0) {
            return seconds + " secs ago";
        } else if (days == 0 && hours == 0) {
            if (minutes == 1) return "1 min ago";
            return  minutes + " mins ago";
        } else if (days == 0) {
            if (hours == 1) return "1 hour ago";
            return hours + " hours ago"
        } else if (days == 1) {
            var d = new Date(timestamp),
                t = d.toLocaleTimeString().split(':');
            return 'yesterday at ' + t[0]+':'+t[1]+' '+t[2].split(' ')[1];
        } else if (days < 7) {
            var d = new Date(timestamp),
                day = dayOfWeek[d.getDay()],
                t = d.toLocaleTimeString().split(':');
            return day + " at " + t[0]+':'+t[1]+' '+t[2].split(' ')[1];
        } else  {
            var d = new Date(timestamp);
            return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
        }
    }

    // interesting solution based on http://stackoverflow.com/questions
    // /15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    readableSize(bytes, decimals) : string  {
        if (bytes === 0) return '0 Byte';

        let k = 1000, // or 1024 for binary
            dm = decimals + 1 || 2;

        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

}

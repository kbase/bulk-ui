
export class Util {

    getClockTime() {
        let date = new Date(),
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();

        let hours = h > 12 ? h - 12 : (h === 0 ? 12 : h),
            mins = m < 10 ? '0'+m : m,
            secs = s < 10 ? '0'+s : s;

        return hours + ":" + mins + ":" + secs + ' ' + (h >= 12 ? 'PM' : 'AM');
    }

}

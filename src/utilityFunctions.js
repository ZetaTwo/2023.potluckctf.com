export function dateToISO (d) {
    function pad (number) {
        if (number < 10) {
            return '0' + number
        }
        return number
    }

    return d.getFullYear() +
        '-' + pad(d.getMonth() + 1) +
        '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) +
        ':' + pad(d.getMinutes()) +
        ':' + pad(d.getSeconds())
}

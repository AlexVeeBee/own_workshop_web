
const cookie = {
    set(name: string, value: string, days: number) {
        let d = new Date();
        d.setTime(d.getTime() + (days*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    },
    get(name: string) {
        let c = document.cookie;
        let ca = c.split(";");
        for (let i = 0; i < ca.length; i++) {
            let cookie = ca[i];
            while (cookie.charAt(0) == " ") {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name + "=") == 0) {
                return cookie.substring(name.length + 1, cookie.length);
            }
        }
        return "";
    },
    remove(name: string) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}

export default cookie;
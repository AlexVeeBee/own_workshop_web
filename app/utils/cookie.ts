
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
            let c = ca[i];
                while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    delete(name: string) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
}

export default cookie;
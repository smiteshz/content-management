module.exports = {
    isEmpty : (obj) => {
        for (key in obj){
            if (obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    }
}
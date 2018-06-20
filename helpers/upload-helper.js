const path = require('path');

module.exports = {
    uploadDir: path.join(__dirname,'../public/uploads/'),

    isEmpty : (obj) => {
        for (key in obj){
            if (obj.hasOwnProperty(key)){
                return false;
            }
        }
        return true;
    }
}
const moment = require('moment');

module.exports = {
    select: (selected, options) => {
        // console.log(selected);
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
    },

    formatDate: (date, format) => {
        return moment(date).format(format);
    }
};
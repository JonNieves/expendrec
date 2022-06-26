module.exports = {
    get: function (){
        var a = new Date();
        var y = a.getFullYear();
        var m = a.getMonth();
        var day = a.getDay();
        var d = a.getDate();
        var h = a.getHours();
        var min = a.getMinutes();
        var time_since_1970 = a.getTime();
        
        var myDateObject = {
            "original_date_object": a,
            "time_since_1970": time_since_1970,
            "dayName" : day,
            "month" : m,
            "day" : d, 
            "year" : y,
            "hours" : h,
            "minutes" : min,
            "string" : null
        };
        
        var aOrP;
        
        //convert day number to monday, tues etc
        if (day == 0){
            day = "Sunday";
        }
        else if (day == 1){
            day = "Monday";
        }
        else if (day == 2){
            day = "Tuesday";
        }
        else if (day == 3){
            day = "Wednesday";
        }
        else if (day == 4){
            day = "Thursday";
        }
        else if (day == 5){
            day = "Friday";
        }
        else if (day == 6){
            day = "Saturday";
        }
        
        //convert month number to string name
        if (m == 0){
            m = "January";
        }
        else if (m == 1){
            m = "February";
        }
        else if (m == 2){
            m = "March";
        }
        else if (m == 3){
            m = "April";
        }
        else if (m == 4){
            m = "May";
        }
        else if (m == 5){
            m = "June";
        }
        else if (m == 6){
            m = "July";
        }
        else if (m == 7){
            m = "August";
        }
        else if (m == 8){
            m = "September";
        }
        else if (m == 9){
            m = "October";
        }
        else if (m == 10){
            m = "November";
        }
        else if (m == 11){
            m = "December";
        }
        
        //convert hours
        if (h > 12){
            h = h - 12;
            aOrP = "PM";
        }
        else if (h === 12){
            aOrP = "PM";
        }
        else if (h === 0){
            h = 12;
            aOrP = "AM";
        }
        else if (h < 12){
            aOrP = "AM";
        }
        
        //minutes look weird with only 1 digit...
        if (min < 10){
            min = "0" + min;
        }
        
        //add string to date object
        myDateObject.string = day + " " + m + " " + d + ", " + y + " " + h + ":" + min + aOrP;
        
        return myDateObject;
    },
    import_date: function(new_time){

        var a = new Date(new_time.year, new_time.month, new_time.day, new_time.hour, new_time.minute, new_time.second, new_time.millisecond);
        var y = a.getFullYear();
        var m = a.getMonth();
        var day = a.getDay();
        var d = a.getDate();
        var h = a.getHours();
        var min = a.getMinutes();
        var time_since_1970 = a.getTime();
        
        var myDateObject = {
            "original_date_object": a,
            "time_since_1970": time_since_1970,
            "dayName" : day,
            "month" : m,
            "day" : d, 
            "year" : y,
            "hours" : h,
            "minutes" : min,
            "string" : null
        };
        
        var aOrP;
        
        //convert day number to monday, tues etc
        if (day == 0){
            day = "Sunday";
        }
        else if (day == 1){
            day = "Monday";
        }
        else if (day == 2){
            day = "Tuesday";
        }
        else if (day == 3){
            day = "Wednesday";
        }
        else if (day == 4){
            day = "Thursday";
        }
        else if (day == 5){
            day = "Friday";
        }
        else if (day == 6){
            day = "Saturday";
        }
        
        //convert month number to string name
        if (m == 0){
            m = "January";
        }
        else if (m == 1){
            m = "February";
        }
        else if (m == 2){
            m = "March";
        }
        else if (m == 3){
            m = "April";
        }
        else if (m == 4){
            m = "May";
        }
        else if (m == 5){
            m = "June";
        }
        else if (m == 6){
            m = "July";
        }
        else if (m == 7){
            m = "August";
        }
        else if (m == 8){
            m = "September";
        }
        else if (m == 9){
            m = "October";
        }
        else if (m == 10){
            m = "November";
        }
        else if (m == 11){
            m = "December";
        }
        
        //convert hours
        if (h > 12){
            h = h - 12;
            aOrP = "PM";
        }
        else if (h === 12){
            aOrP = "PM";
        }
        else if (h === 0){
            h = 12;
            aOrP = "AM";
        }
        else if (h < 12){
            aOrP = "AM";
        }
        
        //minutes look weird with only 1 digit...
        if (min < 10){
            min = "0" + min;
        }
        
        //add string to date object
        myDateObject.string = day + " " + m + " " + d + ", " + y + " " + h + ":" + min + aOrP;
        
        return myDateObject;
    }
};
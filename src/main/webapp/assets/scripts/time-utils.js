function getAdjustedStartOfDayForTime(given)
{

    var browserSOD = moment().sod().valueOf();
    var utcSOD = moment.utc(browserSOD).sod().valueOf();
    var timeZoneDiff = browserSOD - utcSOD;

    var givenSOD = moment(given).sod().valueOf();
    var utcGivenSOD = moment.utc(givenSOD).sod().valueOf();
    var givenTimeZoneDiff = givenSOD - utcGivenSOD;

    var adjustment = timeZoneDiff - givenTimeZoneDiff;
    var adjusted = givenSOD + adjustment;

    return adjusted;

}

function getAdjustedEndOfDayForTime(given)
{
    var sod = getAdjustedStartOfDayForTime(given);
    var adjusted = sod - 1 + (24 * 60 * 60 * 1000);
    return adjusted;
}

function getStartTime(typeOfTimeFrame)
{
    if (typeOfTimeFrame == 'thisweek')
    {
        return moment().day(0).hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();
    }
    else if (typeOfTimeFrame == 'thismonth')
    {
        return moment().startOf('month').valueOf();
    }
    else if (typeOfTimeFrame == 'lastweek')
    {
        return moment().day(0).hours(0).minutes(0).seconds(0).milliseconds(0).subtract('days',7).valueOf();
    }
    else if (typeOfTimeFrame == 'lastmonth')
    {
        return moment().date(1).subtract('months',1).hours(0).minutes(0).seconds(0).milliseconds(0).valueOf();
    }
    else if (typeOfTimeFrame == 'alltime')
    {
        return -1 * (moment().startOf('day').valueOf());
    }
    else if (typeOfTimeFrame == 'today')
    {
        return moment().sod().valueOf();
    }
}

function now()
{
    var now = new Date();
    return now.getTime();
}

function midnight()
{
    return moment().sod().valueOf();
}

function getDaysMillis(days)
{
    return days * 24 * 60 * 60 * 1000;
}

function getEndTime(typeOfTimeFrame)
{
    if (typeOfTimeFrame == 'thisweek')
    {
        return moment().sod().day(6).valueOf();
    }
    else if (typeOfTimeFrame == 'lastweek')
    {
        return moment(getStartTime('lastweek')).add('days', 6).endOf('day').valueOf();
    }
    else if (typeOfTimeFrame == 'alltime')
    {
        return new Date().getTime();
    }
    else if (typeOfTimeFrame == 'lastmonth')
    {
        return moment(getStartTime('thismonth')).subtract('days',1).endOf('day').valueOf();
    }
    else if (typeOfTimeFrame == 'today')
    {
        return moment().sod().add('days', 1).valueOf();
    }
}


function getStartAndEndTime(typeOfTimeFrame)
{
    var results = new  Array();

    if (typeOfTimeFrame == 'thisweek')
    {
        results.push(getStartTime(typeOfTimeFrame));
        results.push(getEndTime(typeOfTimeFrame));
    }
    else if (typeOfTimeFrame == 'lastweek')
    {
        results.push(getStartTime(typeOfTimeFrame));
        results.push(getEndTime(typeOfTimeFrame));
    }
    else if (typeOfTimeFrame == 'thismonth')
    {
        results.push(getStartTime(typeOfTimeFrame));
        results.push(getEndTime('thisweek'));
    }
    else if (typeOfTimeFrame == 'lastmonth')
    {
        results.push(getStartTime('lastmonth'));
        results.push(getEndTime('lastmonth'));
    }
    else if (typeOfTimeFrame == 'today')
    {
        results.push(getStartTime('today'));
        results.push(getEndTime('today'));
    }
    else if (typeOfTimeFrame == '1d')
    {
        results.push(midnight());
        results.push(now());
    }
    else if (typeOfTimeFrame == '5d')
    {
        results.push(midnight() - getDaysMillis(5) );
        results.push(now());
    }
    else if (typeOfTimeFrame == '10d')
    {
        results.push(midnight() - getDaysMillis(10) );
        results.push(now());
    }
    else if (typeOfTimeFrame == '1m')
    {
        results.push(midnight() - getDaysMillis(31) );
        results.push(now());
    }
    else if (typeOfTimeFrame == '3m')
    {
        results.push(midnight() - getDaysMillis(93) );
        results.push(now());
    }
    else if (typeOfTimeFrame == '1y')
    {
        results.push(midnight() - getDaysMillis(365) );
        results.push(now());
    }
    return results;
}

function formatDate(timeMs)
{
    var date = new Date(timeMs);
    var month = date.getMonth();
    var strMonth = '';

    switch(month)
    {
        case 0:
            strMonth = "Jan";
            break;
        case 1:
            strMonth = "Feb";
            break;
        case 2:
            strMonth = "Mar";
            break;
       case 3:
            strMonth = "Apr";
            break;
       case 4:
            strMonth = "May";
            break;
       case 5:
            strMonth = "Jun";
            break;
       case 6:
            strMonth = "Jul";
            break;
       case 7:
            strMonth = "Aug";
            break;
       case 8:
            strMonth = "Sep";
            break;
       case 9:
            strMonth = "Oct";
            break;
       case 10:
            strMonth = "Nov";
            break;
       case 11:
            strMonth = "Dec";
            break;
    }

    return strMonth + " "  + date.getDate() + ", " + date.getFullYear();
}
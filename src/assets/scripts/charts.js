var OD = new Object();

OD.dateRange = {
    rangeStart: 0,
    rangeEnd: 0,
    viewStart: 0,
    viewEnd: 0,
    noDSTAdjustedViewStart: 0,
    noDSTAdjustedViewEnd: 0,
    duration: "",
    setDefaultView: function()
    {
        this.viewStart = getStartTime('thisweek');
        this.viewEnd = getEndTime('thisweek');
        this.noDSTAdjustedViewStart = getAdjustedStartOfDayForTime(this.viewStart);
        this.noDSTAdjustedViewEnd= getAdjustedEndOfDayForTime(this.viewEnd);
        this.duration = 'thisweek';
    },
    updateStartEndViewDates: function(start, end)
    {
        this.viewStart = start;
        this.viewEnd = end;
        this.noDSTAdjustedViewStart = getAdjustedStartOfDayForTime(start);
        this.noDSTAdjustedViewEnd= getAdjustedEndOfDayForTime(end);
        $(document).trigger('status.dates.updated',[true])
    },
    init: function()
    {
        this.setDefaultView();
        if (OD.chartData.length > 0)
        {
            this.rangeStart = parseInt(OD.chartData[0][0]); 
            this.rangeEnd = parseInt(OD.chartData[OD.chartData.length - 1][0]);
            $(document).trigger('status.dates.init',[true]);
        }
   
    }
};

OD.funct = {
    populateConnectionSelect : function(target)
    {
        var connectionNames = OD.connectionNames;
        for (var connId in connectionNames)
        {
           var option = '<option value="' + connId + '"' 
                 + ' >' + connectionNames[connId] +'</option>';
           $('#' + target).append(option); 
        }
    }
};


OD.funct.fetchAndPopulate = function(connectionUuid)
{
	var isPerConnection = typeof connectionUuid != "undefined";

	if (isPerConnection)
	{
		var ajaxUrl = '/web-portal/ajax/user/ajax/connectionstats';
	    var ajaxRequestData = {
	        'startTime': getStartTime('alltime'),
	        'connectionUuid': connectionUuid
	    };
	}
	else
	{
		var ajaxUrl = '/web-portal/ajax/user/ajax/authcounts';
	    var ajaxRequestData = {
	        startTime: getStartTime('alltime')
	    };
		
	}    

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    $.ajax({
        url: ajaxUrl,
        data: ajaxRequestData,
        dataType: 'json',
        type: 'get',
        success: function(data){
            OD.chartData = data;
            OD.connectionNames = new Object();
            OD.dateRange.init();
            OD.funct.loadMasterChart();
            OD.successCount = new OD.funct.LoginSummaryCount('success-today','success');
            OD.failCount = new OD.funct.LoginSummaryCount('failure-today','fail');
            
            if (!isPerConnection)
            {
            	_.each(
                        OD.chartData, 
                        function(values) 
                        {
                            if (!_.isEmpty(values[2]))
                            {
                                this[values[2]] = values[4];
                            }
                        },
                        OD.connectionNames
                        );
            	 OD.historicalLoginChart = new OD.funct.HistoricalTrendChart('loginSuccessTrends','success');
                 OD.historicalFailureChart = new OD.funct.HistoricalTrendChart('loginFailureTrends','fail');
                
            }
          
        },
        error: function(data, textStatus){
            populateError(targetCharts);
        }
    }); 

}

OD.funct.loadMasterChart = function()
{
    OD.masterChart = 
    {
        timeRange: 
        {
            start: 0,
            end: 0
        },
        targetBase: 'loginConnections',
        chart: new Object(),
        init: function() 
        {
            var dataSet = this.filterDataSet();

            $("#master-date-selected-start").html(formatDate(OD.dateRange.viewStart));
            $("#master-date-selected-end").html(formatDate(OD.dateRange.viewEnd));

            this.chart = new Highcharts.Chart({
            chart: {
                    renderTo: 'master-date-chart',
                    reflow: false,
                    zoomType: 'x',
                    spacingLeft: 20,   
					backgroundColor: 'transparent',
                    events: {
                            // listen to the selection event on the master chart to update the
                            // extremes of the detail chart
                            selection: function(event) {
                                var extremesObject = event.xAxis[0];
                                var min = moment(extremesObject.min).startOf('day').valueOf();
                                var max = moment(extremesObject.max).endOf('day').valueOf();

                                $('a[id|="loginConnections-timelinkrange"]').removeAttr('style');
                                OD.dateRange.updateStartEndViewDates(min,max);
                                OD.masterChart.updatePlotBands();
                                return false;
                            },
                            redraw: function(event)
                            {
                                OD.masterChart.updatePlotBands();
                            }
                        }
            },
            credits: {
                enabled: false
            },
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            tooltip: {
                shared: true
            },
            xAxis: {
                type: 'datetime',
                showLastTickLabel: true,
                maxZoom: 1 * 24 * 3600000, // one day
                minTickInterval: 1 * 24 * 3600000,
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: "Logins",
                    style: { 
                        color: '#999999' 
                    }
                },
                min: 0,
                gridLineWidth: 0,
                labels: {
                    enabled: false
                },
                min: 0,
                showFirstLabel: true 
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                series: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 70],
                        stops: [
                            [0, '#4572A7'],
                            [1, 'rgba(0,0,0,0)']
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    shadow: false,
                    states: {
                        hover: {
                            enabled: false 
                        }
                    },
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: OD.dateRange.rangeStart
                }
            },
            series: [{
                type: 'area',
                name: 'Authentication',
                data: dataSet
            }],
            exporting: {
                enabled: false
            }
            });

            this.reSizeChartArr(getStartAndEndTime('10d')); 
            this.updatePlotBands();

        },
        timeRangeZoom: $('a[id|="loginConnections-timelinkzoom"]') 
                .click(function()
                {
                    $('a[id|="loginConnections-timelinkzoom"]').removeAttr('style');
                    $(this).css("color","#000");
                    var duration = this.id.replace(/loginConnections-timelinkzoom-/g,'');
                    var start, end = 0;
                    if (duration == 'all')
                    {
                        start = OD.dateRange.rangeStart;
                        end= OD.dateRange.rangeEnd;
                    }
                    else
                    {
                        var timeFrame = getStartAndEndTime(duration);
                        start = timeFrame[0];
                        end = timeFrame[1];
                    }
                    OD.masterChart.reSizeChart(start,end);
                }),
        timeRangeDefaults: $('a[id|="loginConnections-timelinkrange"]') 
                .click(function()
                {
                    $('a[id|="loginConnections-timelinkrange"]').removeAttr('style');
                    $(this).css("color","#000");
                    var duration = this.id.replace(/loginConnections-timelinkrange-/g,'');
                    var zoomtimeFrame = new Array();
                    var rangeTimeFrame= new Array();
                    var zoomtime = '';

                    if (duration == 'all')
                    {
                        zoomtime = 'all';
                        zoomtimeFrame = [OD.dateRange.rangeStart, OD.dateRange.rangeEnd]; 
                        rangeTimeFrame =[OD.dateRange.rangeStart, OD.dateRange.rangeEnd]; 
                    }
                    else 
                    { 
                        if (duration == 'thisweek') 
                        {
                            zoomtime ='10d';
                        }
                        else if (duration == 'lastweek')
                        {
                            zoomtime ='1m';
                        }
                        else if (duration == 'thismonth')
                        {
                            zoomtime ='3m';
                        }
                        else if (duration == 'lastmonth')
                        {
                            zoomtime ='3m';
                        }
                        else if (duration == 'today')
                        {
                            zoomtime ='10d';
                        }
                        zoomtimeFrame = getStartAndEndTime(zoomtime);
                        rangeTimeFrame = getStartAndEndTime(duration);
                    }

                    $('a[id|="loginConnections-timelinkzoom"]').removeAttr('style');
                    $('#loginConnections-timelinkzoom-' + zoomtime).css("color","#000");
                    OD.masterChart.reSizeChartArr(zoomtimeFrame);

                    OD.dateRange.updateStartEndViewDates(rangeTimeFrame[0],rangeTimeFrame[1]);
                    OD.masterChart.updatePlotBands();
                }),
        eventListenr: $(document).bind("status.dates.updated", function(e, status)
        {
            $("#master-date-selected-start").html(formatDate(OD.dateRange.viewStart));
            $("#master-date-selected-end").html(formatDate(OD.dateRange.viewEnd));
        }),
        updatePlotBands: function()
        {
            var xAxis = this.chart.xAxis[0];
            xAxis.removePlotBand('mask-selected');
            xAxis.addPlotBand({
                id: 'mask-selected',
                from: OD.dateRange.viewStart,
                to: OD.dateRange.viewEnd,
                color: '#D9EDF7'
            });
        },
        reSizeChartArr: function(range)
        {
            this.reSizeChart(range[0],range[1]);
        },
        reSizeChart: function(start,end)
        {
            this.timeRange.start = start;
            this.timeRange.end = end;    
            this.doChartResize();
        },
        doChartResize: function()
        {
            this.chart.xAxis[0].setExtremes(this.timeRange.start, this.timeRange.end);
        },
        filterDataSet: function()
        {
            var workingDate = -1;
            var accumulator = 0;
            var dataSet = new Array();

            for (var i = 0; i < OD.chartData.length; i++)
            {
                var row = OD.chartData[i];
                var currentDate = parseInt(row[0]);
                var currentCount = 0;
                if (!_.isEmpty(row[3]))
                {
                    currentCount = parseInt(row[3]);
                }
                
                if (currentDate >= OD.dateRange.rangeStart 
                        && currentDate <= OD.dateRange.rangeEnd)
                {
                    if (workingDate == -1)
                    {
                        workingDate = currentDate;
                        accumulator = currentCount;
                    }
                    else if (currentDate > workingDate) 
                    {
                        dataSet.push(accumulator);
                        accumulator = currentCount;
                        workingDate = currentDate;
                    }
                    else
                    {
                        accumulator = accumulator + currentCount;
                    }
                }
            }
            dataSet.push(accumulator);
            return dataSet;
        }
    };
    OD.masterChart.init();
}

OD.funct.HistoricalTrendChart = function(target,typeOfLogin)
{
    function connectionCountFilter()
    {
        var dataSet = new Array();
        var workingDate = -1;
        var accumulator = 0;
        for (var i = 0; i < OD.chartData.length; i++)
        {
            var row = OD.chartData[i];
            var currentDate = parseInt(row[0]);
            var currentCount = 0;
            
            if ((row[1] == typeOfLogin && !_.isEmpty(row[3])) 
                    && (connectionId == 'all' || connectionId == row[2]))
            {
                currentCount = parseInt(row[3]);
            }

            if (workingDate == -1)
            {
                workingDate = currentDate;
                accumulator = currentCount;
            }
            else if (currentDate > workingDate) 
            {
                dataSet.push(accumulator);
                accumulator = currentCount;
                workingDate = currentDate;
            }
            else
            {
                accumulator = accumulator + currentCount;
            }
        }
        dataSet.push(accumulator);
        return dataSet;
    }

    function filterDataSet()
    {
        var dataSet = connectionCountFilter();
        chart.series[0].setData(dataSet, true);
    }

    function setDateViews()
    {
        chart.xAxis[0].setExtremes(OD.dateRange.viewStart, OD.dateRange.viewEnd);
    }

    this.updateDateRange = function()
    {
        setDateViews();
        filterDataSet();
    }

    //This function to only be invoked by bound juery event
    //'this' would be refering to the scope of the bound value
    this.updateConnectionID = function() 
    {
        connectionId = this.value;
        filterDataSet();
    }

    var that = this;
    var connectionId='all';

    var chart = new Highcharts.Chart({
            chart: {
                    renderTo: target + "-container-chart",
                    backgroundColor: 'none'
            },
            credits: {
                enabled: false
            },
            title: {
                text: '',
                style: {
                    display: 'none'
                }
            },
            xAxis: {
                type: 'datetime',
                maxZoom: 1 * 24 * 3600000,
                min: OD.dateRange.rangeStart,
                max: OD.dateRange.rangeEnd,
                minTickInterval: 1 * 24 * 3600000,
                title: {
                    text: null
                },
                labels: {
                    style: {
                        font: '9px/10px "Helvetica Neue",helvetica,arial,sans-serif'
                    }
                }
            },
            yAxis: {
                title: {
                    text: typeOfLogin == 'success' ? "Logins" : "Failed Logins",
                    style: { 
                        color: '#999999' 
                    }
                },
                min: 0.0,
                maxPadding: ( typeOfLogin == 'success' ? 0.05 : 1),
                startOnTick: false,
                showFirstLabel: true,
                labels:{
                    style:{
                        font: '9px/10px "Helvetica Neue",helvetica,arial,sans-serif'
                    },
                    x: -10,
                    y: 0
                }
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 300],
                        stops: [
                            [0, ( typeOfLogin == 'success' ? '#A2CFD2' : '#DF5106' )],
                            [1, '#FFFFFF']
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: true,
                        radius: 3
                    },
                    shadow: false,
                    states: {
                        hover: {
                            enabled: false                  
                        }
                    }
                },
                series: {
                    pointInterval: 24 * 3600 * 1000,
                    pointStart: OD.dateRange.rangeStart
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                type: 'area',
                name: typeOfLogin,
                data: []
            }]
    }); 

    filterDataSet();
    setDateViews();

    //Initialize Select List
    OD.funct.populateConnectionSelect(target + '-filter-select');

    $(document).bind("status.dates.updated", this.updateDateRange);

    $('#' + target + '-filter-select').change(this.updateConnectionID);

};

OD.funct.LoginSummaryCount = function(target,typeOfLogin)
{
    function filterAndUpdate()
    {
        var count = 
            _.chain(OD.chartData)
            .filter( 
                function(row) 
                {
                    var currentDate = parseInt(row[0]);
                    var currentCount = 0;
                    if (!_.isEmpty(row[3]))
                    {
                       currentCount = parseInt(row[3]);
                    } 
                    return ( currentCount > 0 
                         && currentDate >= OD.dateRange.viewStart 
                         && currentDate <= OD.dateRange.viewEnd 
                         && typeOfLogin == row[1])
                })
            .reduce(function(memo, dataRow)
                     { 
                        return memo + parseInt(dataRow[3]); 
                     }, 0
                    )
             .value();

        $('#' + target).html(count);
    }

    this.updateCount= function() 
    {
        filterAndUpdate();
    }

    filterAndUpdate();
    $(document).bind("status.dates.updated", this.updateCount);

}

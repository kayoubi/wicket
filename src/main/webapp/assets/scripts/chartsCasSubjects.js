OD.funct.collapseSmallDataSlices = function(dataSet)
{
    var filteredDataSet = new Array();

    var totalAuthn = _.reduce(dataSet, 
        function(memo, data)
        {
            return memo + data[1];
        },0); 

    var grouped = _.groupBy(dataSet,
       function(entry) {
           return ((entry[1] / totalAuthn) > 0.05) ? 'map':'other';
       });

    if (grouped.hasOwnProperty('map'))
    {
        filteredDataSet = grouped.map;
    }

    if ( grouped.hasOwnProperty('other'))
    {
        var sumOfOthers= _.reduce(grouped.other,
           function(memo,data) {
               return memo + data[1];
         },0);
        filteredDataSet.push(['OTHER',sumOfOthers]);
    }

    if (filteredDataSet.length == 0)
    {
        filteredDataSet.push(['No Data',0]);
    }

    return filteredDataSet;
}

OD.funct.loadCharts = function()
{

OD.connectionCounterView = {
    dataSet: [['loading',100]],
    view: 'pie',
    timeRange: 'alltime',
    unique: false,
    targetBase: 'loginConnections',
    chart: new Highcharts.Chart({
        chart: {
                renderTo: 'loginConnections-container-chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
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
            shared: false,
            formatter: function() {
                        return '<b>'+ this.point.name +'</b>:'+ this.point.y;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    distance: 15,
                    color: '#000000',
                    connectorColor: '#000000',
                    formatter: function() {
                        var name = this.point.name;
                        if (name.length > 8)
                        {
                            name = name.substr(0,7) + "...";

                        }
                        return '<b>'+ name +'</b>: '+ this.point.y;
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Authentication',
            data: [['loading',100]]
        }]
    }),
    eventListenr: $(document).bind("status.dates.updated", function(e, status)
    {
        OD.connectionCounterView.load();
    }),
    table: $('#loginConnections-container-table-value')
            .dataTable({
                   "bFilter": false,
                   "bLengthChange": false,
                   "bPaginate": true,
                   "iDisplayLength": 4,
                   "bInfo":true,
                   "bAutoWidth": false,
                   "aoColumns": [
                       { "sWidth": "300px" },
                       { "sWidth": "100px" }
                    ]
                      }),
    uniqueIdFilter: $('#loginConnections-filter-check')
             .click(function() 
             {
                OD.connectionCounterView.flipUniqueFlag();
             }),
    selectView: $('#loginConnections-select-link')
            .click(function()
            {
                OD.connectionCounterView.flipView();
            }),
    init: function()
    {
        this.load();
        this.showChart();
    },
    flipView: function()
    {
        if (this.view == 'pie')
        {
            this.showTable();
        }
        else
        {
            this.showChart();
        }
    },
    showTable: function() 
    {
            $('#loginConnections-container-chart').hide();
            $('#loginConnections-container-table').show();
            $('#loginConnections-select-link').html('Display Chart');
            this.view = 'table';
    },
    showChart: function() 
    {
            $('#loginConnections-container-chart').show();
            $('#loginConnections-container-table').hide();
            $('#loginConnections-select-link').html('Display Table');
            this.view = 'pie';
    },
    flipUniqueFlag: function()
    {
        this.unique = !this.unique;
        this.load();
    },
    updateTimeRange: function(duration)
    {
        this.timeRange= duration;
        this.load();
    },
    load: function() 
    {
        this.filterDataSet();
        this.loadChart();
        this.loadTable(); 
    },
    loadChart: function()
    {
        var filteredDataSet = OD.funct.collapseSmallDataSlices(this.dataSet);
        this.chart.series[0].setData(filteredDataSet, true);
    },
    loadTable: function()
    {
        this.table.fnClearTable();
        this.table.fnAddData(this.dataSet, true)
    },
    filterDataSet: function()
    {
        var i = 0;
        // collectors{ cnxID: { count: 0-9, subjects: { sbjId:1 }}}
        var collectors = new Object();

        for (i = 0; i < OD.subjectChartData.length; i++)
        {
            var rowData = OD.subjectChartData[i]; 
            var entryTime = parseInt(rowData[0]);
            if (entryTime >= OD.dateRange.viewStart
                && entryTime <= OD.dateRange.viewEnd
                && rowData[1] == 'success')
            {
                var cnxId = rowData[5]; 
                var collector = new Object();

                if (collectors.hasOwnProperty(cnxId))
                {
                    collector = collectors[cnxId];
                } 
                else
                {
                    collector.count = 0;
                    collector.subjects = new Object();
                    collectors[cnxId] = collector;
                }

                collector.count = collector.count + parseInt(rowData[4]);
                collector.subjects[rowData[3]] = 1;
            }
        }

        this.dataSet = new Array();
        for (collectorId in collectors)
        {
            var idCntPair = new Array();
            idCntPair.push(collectorId);
            if (this.unique)
            {
                var size = 0, key;
                var subjects = collectors[collectorId].subjects;
                for (key in subjects) 
                {
                    if (subjects.hasOwnProperty(key)) size++;
                }
                idCntPair.push(size);
            }
            else
            {
                idCntPair.push(collectors[collectorId].count);
            }
            this.dataSet.push(idCntPair);
        }
      }
}

OD.userConnectionCounterView = {
    dataSet: [['loading',100]],
    view: 'pie',
    timeRange: 'alltime',
    connectionId: 'all',
    targetBase: 'userLoginConnections',
    chart: new Highcharts.Chart({
        chart: {
                renderTo: 'userLoginConnections-container-chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
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
            shared: false,
            formatter: function() {
                        return '<b>'+ this.point.name +'</b>: '+ this.point.y;

            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    distance: 15,
                    overflow: 'justify',
                    formatter: function() {
                        var name = this.point.name;
                        if (name.length > 8)
                        {
                            name = name.substr(0,7) + "...";

                        }
                        return '<b>'+ name +'</b>: '+ this.point.y;
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: 'Authentication',
            data: [['loading',100]]
        }]
    }),
    table: $('#userLoginConnections-container-table-value')
            .dataTable({
                   "bFilter": false,
                   "bLengthChange": false,
                   "bPaginate": true,
                   "iDisplayLength": 4,
                   "bInfo":true,
                   "bAutoWidth": false,
                   "aoColumns": [
                       { "sWidth": "300px" },
                       { "sWidth": "100px" }
                    ]
                      }),
    cnxIdFilter: $('#userLoginConnections-filter-select')
             .change(function() 
             {
                OD.userConnectionCounterView.selectCnxId(this.value);
             }),
    eventListenr: $(document).bind("status.dates.updated", function(e, status)
    {
        OD.userConnectionCounterView.load();
    }),
    selectView: $('#userLoginConnections-select-link')
            .click(function()
            {
                OD.userConnectionCounterView.flipView();
            }),
    init: function()
    {
        this.load();
        OD.funct.populateConnectionSelect('userLoginConnections-filter-select');
        this.showChart();
    },
    flipView: function()
    {
        if (this.view == 'pie')
        {
            this.showTable();
        }
        else
        {
            this.showChart();
        }
    },
    showTable: function() 
    {
            $('#userLoginConnections-container-chart').hide();
            $('#userLoginConnections-container-table').show();
            $('#userLoginConnections-select-link').html('Display Chart');
            this.view = 'table';
    },
    showChart: function() 
    {
            $('#userLoginConnections-container-chart').show();
            $('#userLoginConnections-container-table').hide();
            $('#userLoginConnections-select-link').html('Display Table');
            this.view = 'pie';
    },
    selectCnxId: function(cnxId)
    {
        this.connectionId= cnxId;
        this.load();
    },
    updateTimeRange: function(duration)
    {
        this.timeRange= duration;
        this.load();
    },
    load: function() 
    {
        this.filterDataSet();
        this.loadChart();
        this.loadTable(); 
    },
    loadChart: function()
    {
        var filteredDataSet = OD.funct.collapseSmallDataSlices(this.dataSet);
        this.chart.series[0].setData(filteredDataSet, true);
    },
    loadTable: function()
    {
        this.table.fnClearTable();
        this.table.fnAddData(this.dataSet, true)
    },
    filterDataSet: function()
    {
        var i = 0;
        var collector = new Object();
        var selects = new Object();

        for (i = 0; i < OD.subjectChartData.length; i++)
        {
            var rowData = OD.subjectChartData[i]; 
            var entryTime = parseInt(rowData[0]);
            if (rowData[1] == 'success')
            {
                var cnxId = rowData[2]; 
                selects[cnxId] = rowData[5];
                
                if (entryTime >= OD.dateRange.viewStart && entryTime <= OD.dateRange.viewEnd)
                {
                    if (this.connectionId == 'all' || this.connectionId == cnxId)
                    {
                        var subject = rowData[3];

                        if (!collector.hasOwnProperty(subject))
                        {
                            collector[subject] = 0;
                        }

                    collector[subject] = collector[subject] + parseInt(rowData[4]);
                    }
                }
            }
        }

        //update dataset 
        this.dataSet = new Array();
        for (subject in collector)
        {
            if (collector.hasOwnProperty(subject))
            {
                var idCntPair = new Array();
                idCntPair.push(subject);
                idCntPair.push(collector[subject]);
            }
            this.dataSet.push(idCntPair);
        }

      }

    }

}

$(document).bind("status.dates.init", function(e, status) 
{
    var ajaxUrl = 'ajax/user/ajax/authsubjectcounts';
    var ajaxRequestData = {
        startTime: getStartTime('alltime')
    };
    OD.funct.loadCharts();

    $.ajax({
        url: ajaxUrl,
        data: ajaxRequestData,
        dataType: 'json',
        type: 'get',
        success: function(data){
            OD.subjectChartData = data;
            OD.connectionCounterView.init();
            OD.userConnectionCounterView.init();
        },
        error: function(data, textStatus){
            console.log("Chart loading failure; status: " + textStatus + "; data: " + data);
            populateError(targetCharts);
        }
    }); 

});

const main = document.querySelector('main');

google.charts.load('current', { 'packages': ['corechart', 'line'] });

var period = 's-year'

google.charts.setOnLoadCallback(async () => {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Day');
    const hits = await api.network(null, null, period);
    console.log(hits);
    hits.providers.forEach(provider => data.addColumn('number', provider.name));

    const dataArr = [];
    Object.keys(hits.providers[0].dates).forEach(date => dataArr.push([(new Date(date)).toLocaleDateString()]));
    hits.providers.forEach((provider, i) => Object.keys(provider.dates).forEach((date, j) => {
        dataArr[j][j + 1] = provider.dates[date].total;
    }));

    data.addRows(dataArr);

    var options = {
        chart: {
            title: 'jsDelivr Hits per day in last year',
            subtitle: 'in billions'
        }
    };


    var chart = new google.visualization.LineChart(main.appendChild(document.createElement('div')));

    chart.draw(data, google.charts.Line.convertOptions(options));
});
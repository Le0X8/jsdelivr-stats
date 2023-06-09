const main = document.querySelector('main');

google.charts.load('current', { 'packages': ['corechart', 'line'] });

var period = 's-year'

google.charts.setOnLoadCallback(async () => {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Day');
    const network = await api.network(null, null, period);
    network.hits.providers.forEach(provider => data.addColumn('number', provider.name));

    const dataArr = [];
    Object.keys(network.hits.providers[0].dates).forEach(date => dataArr.push([(new Date(date)).toLocaleDateString()]));
    network.hits.providers.forEach((provider, i) => Object.keys(provider.dates).forEach((date, j) => {
        dataArr[j][i + 1] = provider.dates[date].total / 1000000000;
    }));

    data.addRows(dataArr);

    var options = {
        chart: {
            title: 'jsDelivr Hits per day in ' + (new Date(Object.keys(network.hits.providers[0].dates)[0])).getFullYear(),
            subtitle: 'in billions'
        }
    };

    main.appendChild((name => {
        var el = document.createElement('span');
        el.classList.add('info');
        el.innerText = name;
        return el;
    })('jsDelivr has served a total of ' + network.hits.total.toLocaleString() + ' requests in ' + (new Date(Object.keys(network.hits.providers[0].dates)[0])).getFullYear()));

    main.appendChild((name => {
        var el = document.createElement('span');
        el.classList.add('title');
        el.innerText = name;
        return el;
    })('jsDelivr Hits per day in ' + (new Date(Object.keys(network.hits.providers[0].dates)[0])).getFullYear()));
    main.appendChild((name => {
        var el = document.createElement('span');
        el.classList.add('subtitle');
        el.innerText = name;
        return el;
    })('in billions'));
    var chart = new google.visualization.LineChart(main.appendChild(document.createElement('div')));

    chart.draw(data, google.charts.Line.convertOptions(options));
});
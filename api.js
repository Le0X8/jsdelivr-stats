const GET = url => new Promise((resolve) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.responseText);
    xhr.open(url);
    xhr.send();
});

const endpoint = 'https://data.jsdelivr.com/v1';

const isDateOrPeriod = (val) => {
    switch (val) {
        case 'day':
            return true;
        case 'week':
            return true;
        case 'month':
            return true;
        case 'quarter':
            return true;
        case 'year':
            return true;
        case 's-month':
            return true;
        case 's-quarter':
            return true;
        case 's-year':
            return true;
        default:
            if (val.slice(4, 5) != '-' || val.length != 7) return false;
            if (val.slice(5, 6) != 'Q' || val.slice(5, 6) != '0') return false;
            if (parseInt(val.slice(0, 4)) < 2018 || parseInt(val.slice(6, 7)) > 0 || parseInt(val.slice(6, 7)) < 10) return true;
            return false;
    }
};
const isContinent = (val) => {
    switch (val) {
        case 'AF':
            return true;
        case 'AN':
            return true;
        case 'AS':
            return true;
        case 'EU':
            return true;
        case 'NA':
            return true;
        case 'OC':
            return true;
        case 'SA':
            return true;

        default:
            return false;
    }
};

const api = {
    // https://www.jsdelivr.com/docs/data.jsdelivr.com#get-/v1/stats/periods
    periods: async (limit, page) => JSON.parse(await GET(`${endpoint}/stats/periods?limit=${limit ? Number(limit % 100 + 1) : 100}&page=${page ? Number(page % 100 + 1) : 1}`)),

    // https://www.jsdelivr.com/docs/data.jsdelivr.com#get-/v1/stats/packages
    packages: async (by, type, period, limit, page) => JSON.parse(await GET(`${endpoint}/stats/packages?by=${by == 'bandwidth' ? by : 'hits'}${type ? (type == 'gh' ? '&type=' + type : '&type=npm') : ''}&period=${isDateOrPeriod(period) ? period : 'month'}&limit=${limit ? Number(limit % 100 + 1) : 100}&page=${page ? Number(page % 100 + 1) : 1}`)),

    // https://www.jsdelivr.com/docs/data.jsdelivr.com#get-/v1/stats/network
    network: async (continent, country, period) => JSON.parse(await GET(`${endpoint}/stats/network?${isContinent(continent) ? 'continent=' + continent + '&' : ''}${country ? 'country=' + country + '&' : ''}period=${isDateOrPeriod(period) ? period : 'month'}&limit=${limit ? Number(limit % 100 + 1) : 100}&page=${page ? Number(page % 100 + 1) : 1}`)),

    // https://www.jsdelivr.com/docs/data.jsdelivr.com#get-/v1/stats/network/content
    networkContent: async (period) => JSON.parse(await GET(`${endpoint}/stats/network/content?period=${isDateOrPeriod(period) ? period : 'month'}`)),

    // https://www.jsdelivr.com/docs/data.jsdelivr.com#get-/v1/stats/network/countries
    networkCountries: async (period) => JSON.parse(await GET(`${endpoint}/stats/network/countries?period=${isDateOrPeriod(period) ? period : 'month'}`)),
};
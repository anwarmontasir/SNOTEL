const url = 'https://wcc.sc.egov.usda.gov/reportGenerator/view_csv/customGroupByMonthReport/monthly/651:OR:SNTL%7Cid=%22%22%7Cname/POR_BEGIN,POR_END:1,2,3,4,5,6/WTEQ::collectionDate,SNWD::value,WTEQ::value';

const corsUrl = 'https://cors-anywhere.herokuapp.com/' + url;

let snowArray = [];

let sortObj = {
    sortColumn: 0,
    sortOrder: 0,
    sortClass: ''
}

let units = ['inches', 'centimeters'];

function fetchCSV(corsUrl) {
    fetch(corsUrl)
        .then(response => 
            response.text().then(text =>
                populateSnowArray(CSVToArray(text))
            )
        )
}

function populateSnowArray(csvArray) {
    for (let i=57; i<=95; i++) {
        const snowObj = populateSnowObj(['year', 'janSnow', 'febSnow', 'marSnow', 'aprSnow', 'maySnow', 'junSnow'], [0, 3, 6, 9, 12, 15, 18], csvArray, i);
        snowArray.push(snowObj);
    }
    populateTable(snowArray);
}

function populateSnowObj(keys, indexes, csvArray, i) {
    const snowObj = {};
    let total = 0;
    keys.forEach((key, index) => {
        snowObj[key] = isNaN(parseFloat(csvArray[i][indexes[index]])) ? 0 : parseFloat(csvArray[i][indexes[index]]);
        if (index > 0) total += snowObj[key];
    })
    snowObj.total = Math.floor(total * 10) / 10;
    
    return snowObj;
}

function populateTable(snowArray) {
    let newHTML = `
        <p>Click column header to sort.</p>
        <table>
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Jan</th>
                    <th>Feb</th>
                    <th>Mar</th>
                    <th>Apr</th>
                    <th>May</th>
                    <th>Jun</th>
                    <th>Total</th>
                </tr>
            </thead>`;
    snowArray.forEach(snowYear => {
        newHTML += `
            <tr>
                <td>${snowYear.year}</td>
                <td>${snowYear.janSnow}</td>
                <td>${snowYear.febSnow}</td>
                <td>${snowYear.marSnow}</td>
                <td>${snowYear.aprSnow}</td>
                <td>${snowYear.maySnow}</td>
                <td>${snowYear.junSnow}</td>
                <td>${snowYear.total}</td>
            </tr>`;
    });
    newHTML += `</table>
    <p>Snowpack levels in ${units[0]}.<br><a href="#" id="unitToggle">View as ${units[1]}</a></p>`;
    $('#content').html(newHTML);
}

function handleTHClick() {
    $('#content').on('click', 'th', e => {
        sortObj.sortColumn = $(e.target).index();
        if ($(e.target).hasClass('down')) {
            sortObj.sortOrder = 1;
            sortObj.sortClass = 'up';
        } else {
            sortObj.sortOrder = -1;
            sortObj.sortClass = 'down';
        }
        sortSnowArray(sortObj);
    });
}

function sortSnowArray(sortObj) {
    const keyArray = ['year', 'janSnow', 'febSnow', 'marSnow', 'aprSnow', 'maySnow', 'junSnow', 'total'];
    snowArray.sort(sortByKey(keyArray[sortObj.sortColumn], sortObj.sortOrder));
    populateTable(snowArray);
    if (sortObj.sortClass) {
        $(`th:nth-child(${sortObj.sortColumn + 1})`).addClass(sortObj.sortClass);
        $(`td:nth-child(${sortObj.sortColumn + 1})`).addClass('highlight');
    }
}

function sortByKey(key, order) {
    var sortOrder = order;
    return function (a,b) {
        var result = (a[key] < b[key]) ? -1 : (a[key] > b[key]) ? 1 : 0;
        return result * sortOrder;
    }
}

function handleToggleUnits() {
    $('#content').on('click', '#unitToggle', e => {
        e.preventDefault();
        convertUnits()
    });
}

function convertUnits() {
    snowArray.forEach(snowYear => {
        for (const key in snowYear) {
            if (key !== 'year') {
                if (units[0] === 'inches') {
                    snowYear[key] = Math.round(snowYear[key] * 10 * 2.54) / 10;
                } else {
                    snowYear[key] = Math.round(snowYear[key] * 10 / 2.54) / 10;
                }
            }
        }
    });
    units = units.reverse();
    sortSnowArray(sortObj);
}

$(function() {
    fetchCSV(corsUrl);
    handleTHClick();
    handleToggleUnits();
});
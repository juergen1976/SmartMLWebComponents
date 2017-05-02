var prevX = [];
var prevY = [];
var allX = [];
var allY = [];
var minXChange = 50;
var minYChange = 30;


document.getElementById('run').addEventListener('click', calculateClusters);

document.getElementById('start').addEventListener('click', () => {
    document.querySelector('html').addEventListener('mousemove', getMousePosition);
});

document.getElementById('reset').addEventListener('click', () => {
    prevX = [];
    prevY = [];
    allX = [];
    allY = [];
    var allDivs = document.querySelectorAll('div.kmeans');
    for (var i=0; i<allDivs.length; i++) {
        document.querySelector('body').removeChild(allDivs[i]);
    }
});

function getMousePosition(e) {
    x = e.clientX;
    y = e.clientY;
    var d = new Date();
    var currentTime = d.getTime();

    if (prevX.length == 0 || (currentTime - prevX[0]) > 1000 && (Math.abs(x-prevX[1]) > minXChange && Math.abs(y-prevY[1]) > minYChange)) {
        prevX = [];
        prevY = [];

        prevX.push(currentTime);
        prevX.push(x);
        allX.push(x);

        prevY.push(currentTime);
        prevY.push(y);
        allY.push(y);
    }
}

function calculateClusters() {

    var inputData = [];
    for (var i=0; i< allX.length; i++) {
        inputData.push([allX[i], allY[i]]);
    }
    let initialCenters = [[100, 200], [10, 50], [20,20], [30,30], [50,390], [100,200]];
    var ans = ML.Clust.kmeans(inputData, 6, {maxIterations: 20});

    for (var i=0; i< allX.length; i++) {
        drawCircle(allX[i], allY[i], ans.clusters[i]);
    }
}

function drawCircle(x, y, clusterNr) {
    var div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.style.color = 'red';
    div.classList.add('kmeans');
    div.innerHTML = clusterNr;
    document.querySelector('body').appendChild(div);
}

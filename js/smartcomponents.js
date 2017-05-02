//var mlcart = require('ml-cart');
var DTClassifier = require('ml-cart').DecisionTreeClassifier;

var componentsFeaturesDict = {};
var componentsLabelsDict = {};
var dtcClassifier;

init();

document.getElementById('run').addEventListener('click', () => {
    var componentsFeatures = [];
    var componentsLabels = [];
    for (elementId in componentsLabelsDict) {
        componentsLabels.push(componentsLabelsDict[elementId].valueOf());
        componentsFeatures.push(componentsFeaturesDict[elementId])
    }
    // Train the decision tree
    trainComponentDecisionTree(componentsFeatures, componentsLabels);

    // predict
    alert(predictComponent());
});

document.getElementById('reset').addEventListener('click', () => {
    init();
});

function init() {
    componentsFeaturesDict = {};
    // 0=hovered, 1=width, 2=height, 3=x, 4=y
    componentsLabelsDict = {};
    var allElements = document.querySelectorAll('div.smart');
    for(var i=0; i<allElements.length; i++) {
        var element = allElements[i];
        componentsLabelsDict[element.id] = 0;
        componentsFeaturesDict[element.id] = new Array(5);
        componentsFeaturesDict[element.id][0] = 0;
        componentsFeaturesDict[element.id][1] = element.clientWidth;
        componentsFeaturesDict[element.id][2] = element.clientHeight;
        componentsFeaturesDict[element.id][3] = element.offsetLeft;
        componentsFeaturesDict[element.id][4] = element.offsetTop;

        element.addEventListener('click', (event) => {
            componentsLabelsDict[event.target.id] = 1;
            alert('clicked element id: ' + event.target.id);
        });
        element.addEventListener('mouseenter', (event) => {
            componentsFeaturesDict[event.target.id][0] = 1;
            event.target.style.backgroundColor = 'green';
        });
        element.addEventListener('mouseout', (event) => {
            event.target.style.backgroundColor = 'white';
        });
    }

    initDecisionTree();
}


function initDecisionTree() {
    var options = {
        gainFunction: 'gini',
        maxDepth: 10,
        minNumSamples: 3
    };

    dtcClassifier = new DTClassifier(options);
}

function trainComponentDecisionTree(componentsFeatures, componentsLabels) {
    dtcClassifier.train(componentsFeatures, componentsLabels);
}

function predictComponent() {
    var hovered = document.getElementById('predHovered').value;
    var width = document.getElementById('predWidth').value;
    var height = document.getElementById('predHeight').value;
    var x = document.getElementById('predX').value;
    var y = document.getElementById('predY').value;
    return dtcClassifier.predict([[hovered.valueOf(),width.valueOf(),height.valueOf(),x.valueOf(),y.valueOf()]])
}

function elementInViewport(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while(el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top >= window.pageYOffset &&
        left >= window.pageXOffset &&
        (top + height) <= (window.pageYOffset + window.innerHeight) &&
        (left + width) <= (window.pageXOffset + window.innerWidth)
    );
}

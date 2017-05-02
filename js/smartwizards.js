var goethe = `Ihr beiden, die ihr mir so oft,
In Not und Trübsal, beigestanden,
Sagt, was ihr wohl in deutschen Landen
Von unsrer Unternehmung hofft?
Ich wünschte sehr der Menge zu behagen,
Besonders weil sie lebt und leben läßt.
Die Pfosten sind, die Bretter aufgeschlagen,
Und jedermann erwartet sich ein Fest.
Sie sitzen schon mit hohen Augenbraunen
Gelassen da und möchten gern erstaunen.
Ich weiß, wie man den Geist des Volks versöhnt;
Doch so verlegen bin ich nie gewesen:
Zwar sind sie an das Beste nicht gewöhnt,
Allein sie haben schrecklich viel gelesen.
Wie machen wir's, daß alles frisch und neu
Und mit Bedeutung auch gefällig sei?
Denn freilich mag ich gern die Menge sehen,
Wenn sich der Strom nach unsrer Bude drängt,
Und mit gewaltig wiederholten Wehen
Sich durch die enge Gnadenpforte zwängt;
Bei hellem Tage, schon vor vieren,
Mit Stößen sich bis an die Kasse ficht
Und, wie in Hungersnot um Brot an Bäckertüren,
Um ein Billet sich fast die Hälse bricht.
Dies Wunder wirkt auf so verschiedne Leute
Der Dichter nur; mein Freund, o tu es heute!
O sprich mir nicht von jener bunten Menge,
Bei deren Anblick uns der Geist entflieht.
Verhülle mir das wogende Gedränge,
Das wider Willen uns zum Strudel zieht.
Nein, führe mich zur stillen Himmelsenge,
Wo nur dem Dichter reine Freude blüht;
Wo Lieb und Freundschaft unsres Herzens Segen
Mit Götterhand erschaffen und erpflegen.

Ach! was in tiefer Brust uns da entsprungen,
Was sich die Lippe schüchtern vorgelallt,
Mißraten jetzt und jetzt vielleicht gelungen,
Verschlingt des wilden Augenblicks Gewalt.
Oft, wenn es erst durch Jahre durchgedrungen,
Erscheint es in vollendeter Gestalt.
Was glänzt, ist für den Augenblick geboren,
Das Echte bleibt der Nachwelt unverloren.
Wenn ich nur nichts von Nachwelt hören sollte.
Gesetzt, daß ich von Nachwelt reden wollte,
Wer machte denn der Mitwelt Spaß?
Den will sie doch und soll ihn haben.
Die Gegenwart von einem braven Knaben
Ist, dächt ich, immer auch schon was.
Wer sich behaglich mitzuteilen weiß,
Den wird des Volkes Laune nicht erbittern;
Er wünscht sich einen großen Kreis,
Um ihn gewisser zu erschüttern.
Drum seid nur brav und zeigt euch musterhaft,
Laßt Phantasie, mit allen ihren Chören,
Vernunft, Verstand, Empfindung, Leidenschaft,
Doch, merkt euch wohl! nicht ohne Narrheit hören.
Besonders aber laßt genug geschehn!
Man kommt zu schaun, man will am liebsten sehn.
Wird vieles vor den Augen abgesponnen,
So daß die Menge staunend gaffen kann,
Da habt Ihr in der Breite gleich gewonnen,
Ihr seid ein vielgeliebter Mann.
Die Masse könnt Ihr nur durch Masse zwingen,
Ein jeder sucht sich endlich selbst was aus.
Wer vieles bringt, wird manchem etwas bringen;
Und jeder geht zufrieden aus dem Haus.
Gebt Ihr ein Stück, so gebt es gleich in Stücken!
Solch ein Ragout, es muß Euch glücken;
Leicht ist es vorgelegt, so leicht als ausgedacht.
Was hilft's, wenn Ihr ein Ganzes dargebracht?
Das Publikum wird es Euch doch zerpflücken.`;

var t = 0;
var tprev;
var sentencedata = new Array();
var readingtime = new Array();


var text = goethe;

var n = -1;
var sentences = text.split(".");
var sentence;

var auto = false;

function init() {
    t = 0;
    textdiv.innerHTML = "Johann Wolfgang von Goethe: Faust: Eine Tragödie - Kapitel 2 - Vorspiel auf dem Theater ";
}

function sentenceStats( str ) {
    // Compute statistics for this sentence
    var words = str.split(" ");
    var nWords = words.length;
    var avgWordLength = 0;
    var maxWordLength = 0;
    for ( var w = 0; w < nWords; w++) {
        avgWordLength += words[w].length;
        if( words[w].length > maxWordLength )
            maxWordLength = words[w].length;
    }
    avgWordLength /= nWords;

    var reg=new RegExp("[,;:]+", "g");
    var nSigns = str.split(reg).length;

    return [ nWords, avgWordLength, maxWordLength, nSigns ];
}

function next() {

    if ( n >= sentences.length-1 ) {
        // Last sentence written
        // so just stop
        textdiv.innerHTML = "Finished learning."
    }
    else if ( auto ) {
        // Prepare the data for the next sentence:
        n++;
        sentence = sentences[n];
        var x = sentenceStats(sentence) ;
        var predictedTime = model.predict( x );
        setTimeout(next, predictedTime ) ;
    }
    else if ( n == 10 ) {
        // Create a predictive model
        model = new Regression(LeastSquares);

        // Convert our Array of data to a Matrix:
        var X = array2mat( sentencedata );

        // An Array of labels can be used directly as a vector of labels:
        var Y = readingtime;

        // Train the model on the data matrix X and target vector Y
        model.train( X, Y );

        // Turn on the automatic mode for the application:
        auto = true;

        // Remove the grey box to inform the user that everything is automatic
        textdiv.style.background = "white";

        // and call for the next piece of text
        setTimeout(next,0);
    }
    else if ( n >= 0) {
        sentencedata.push( sentenceStats(sentence) );

        // also record the reading time (in ms):
        tprev = t;
        t = (new Date()).getTime();

        readingtime.push( t-tprev );

        // Go on with next sentence
        n++;
        sentence = sentences[n];
    }
    else {
        // Start timing
        t = (new Date()).getTime();

        // Go on with next sentence
        n++;
        sentence = sentences[n];
    }

    // Write next sentence
    textdiv.innerHTML = sentences[n] + ".";
}

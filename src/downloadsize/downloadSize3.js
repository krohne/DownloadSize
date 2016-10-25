/* 
 * jjs downloadsize3.js
 * Sample config.json:
 * [
 *      "http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
 *      "https://www.merchante-solutions.com/wp-content/themes/Foundation-master/img/logo2.png",
 *      "http://www.cnn.com/",
 *      "http://www.w3schools.com/html/html_examples.asp"
 * ]
 * 
 * Take an input file that is a json array of URLs and the output file provides
 * a json array that contains each URL, its size, and the total number of 
 * requests.
 * Parse any HTML in the URL and report on the total size (i.e., the app figures
 * out the size of all of the JavaScript, images, etc. and adds that to the 
 * total). It should also report on the total number of requests that were 
 * required for this. 
 */

/* global Collectors */

var Files = Java.type('java.nio.file.Files');
var Paths = Java.type('java.nio.file.Paths');
var FileWriter = Java.type("java.io.FileWriter");
var URL = Java.type('java.net.URL');
var StandardOpenOption = Java.type("java.nio.file.StandardOpenOption");
var Arrays = Java.type("java.util.Arrays");
var Collectors = Java.type("java.util.stream.Collectors");
var BufferedReader = Java.type("java.io.BufferedReader");
var InputStreamReader = Java.type("java.io.InputStreamReader");
var HTMLEditorKit = Java.type('javax.swing.text.html.HTMLEditorKit');
var HTMLDocument = Java.type('javax.swing.text.html.HTMLDocument');
var Element = Java.type('javax.swing.text.Element');
var ElementIterator = Java.type('javax.swing.text.ElementIterator');
var Reader = Java.type('java.io.Reader');
var HTML = Java.type('javax.swing.text.html.HTML');

function getSize(url) {
    var urlc = new URL(url);
    var relurl = urlc.getProtocol() + "://" + urlc.getHost() + (urlc.getPort() > 0 ? ":" + urlc.getPort() : '') + urlc.getPath();
    var connection = null;
    try {
        connection = urlc.openConnection();
    } catch (ex) {
        connection.disconnect();
        return {url: url, size: 0, requests: 1};
    }
    var len = Math.max(0, connection.getContentLength());  // Could be -1 if denied
    var req = 1;    // Always at least 1 request
    // print('\t', connection.getContentType());
    if (connection.getContentType().startsWith('text/html')) {
        var kit = new HTMLEditorKit();
        var doc = kit.createDefaultDocument();
        doc.putProperty("IgnoreCharsetDirective", true);
        var reader = null;
        try {
            reader = new InputStreamReader(connection.getInputStream());
        } catch (ex) {
            connection.disconnect();
            return {url: url, size: 0, requests: 1};
        }
        kit.read(reader, doc, 0);
        var iter = new ElementIterator(doc);
        var elem = null;
        var src = '';
        var srcsize = null;
        while ((elem = iter.next()) !== null) {
            if (elem.isDefined(HTML.Attribute.SRC)) {
                src = elem.getAttribute(HTML.Attribute.SRC);
                if (src.startsWith('data')) {
                    continue;   // Already been counted with getContentType
                }
                srcURL = new URL(urlc, src);    // Converts to absolute URL
                // print(elem.getName(), srcURL.toString());
                srcsize = getSize(srcURL.toString());
                req++;
                len += Math.ceil(0, srcsize.size);
                // print(JSON.stringify(srcsize, null, '\t'));
            }
        }
    }
    connection.disconnect();
    return {url: url, size: len, requests: req};
}

var configFile = 'config.json';
var path = Paths.get(configFile);
var json = Files
        .readAllLines(path)
        .stream()
        .collect(Collectors.joining(""));
// print(json);
var result = JSON.parse(json);

var sizes = result.map(function (url) {
    print('Target:', url);
    return getSize(url);
});
Files.write(
        Paths.get("output.json"),
        Arrays.asList(JSON.stringify(sizes)),
        StandardOpenOption.CREATE,
        StandardOpenOption.TRUNCATE_EXISTING
        );
print('Results:', Paths.get('ouput.json'));

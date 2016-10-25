#!env jjs
/* 
 * jjs downloadsize2.js
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
 */

/* global Collectors */

var Files = Java.type('java.nio.file.Files');
var Paths = Java.type('java.nio.file.Paths');
var FileWriter = Java.type("java.io.FileWriter");
var URL = Java.type('java.net.URL');
var StandardOpenOption = Java.type("java.nio.file.StandardOpenOption");
var Arrays = Java.type("java.util.Arrays");
var Collectors = Java.type("java.util.stream.Collectors");

function getSize(url) {
    var connection = new URL(url).openConnection();
    // print(url, '-', connection.getContentType());
    var len = Math.max(0, connection.getContentLength());    // Could be -1
    connection.disconnect();
    return len;
}

var configFile = 'config.json';
var path = Paths.get(configFile);
var json = Files
    .readAllLines(path)
    .stream()
    .collect(Collectors.joining(""));
// print(json);
var result = JSON.parse(json);
var sizes = result.map(function(url) {1
    print('Target:', url);
    return { url : url, size: getSize(url) };
});
Files.write(
    Paths.get("./output.json"), 
    Arrays.asList(JSON.stringify(sizes)), 
    StandardOpenOption.CREATE, 
    StandardOpenOption.TRUNCATE_EXISTING
    );

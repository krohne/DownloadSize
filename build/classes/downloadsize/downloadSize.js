#!env jjs
/*
 * jjs downloadsize.js
 * Sample config.txt:
 *     http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf
 * a command-line app that runs 1 time. It reads the URL from a local config 
 * file and writes the size of the file (PDF, image, HTML, etc.) to an output 
 * file.
 */

var Files = Java.type('java.nio.file.Files');
var Paths = Java.type('java.nio.file.Paths');
var FileWriter = Java.type("java.io.FileWriter");
var URL = Java.type('java.net.URL');
var StandardOpenOption = Java.type("java.nio.file.StandardOpenOption");
var Arrays = Java.type("java.util.Arrays");

function getSize(url) {
    var connection = new java.net.URL(url).openConnection();
    var len = connection.getHeaderField('Content-Length');    // Just the header, please
    connection.disconnect();
    return len;
}

var configFile = 'config.txt';
var path = Paths.get(configFile);
var linesRead = Files.readAllLines(path);
var url = linesRead[0];
var linesWritten = [getSize(url) + ' - ' + url];
// print(linesWritten);
Files.write(Paths.get("./output.txt"), Arrays.asList(linesWritten), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

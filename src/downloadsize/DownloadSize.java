import java.io.FileNotFoundException;
import java.io.FileReader;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
/**
 *
 * @author GregK
 */
public class DownloadSize {
    

    /**
     * @param args the command line arguments
     * 1.       The app is a command-line app that runs 1 time. It reads the URL from a local config file and writes the size of the file (PDF, image, HTML, etc.) to an output file.
     * 
     * 2.       The app takes an input file that is a json array osw```2qf URLs and the output file provides a json array that contains each URL, its size, and the total number of requests.
     * 
     * 3.       The app can now parse any HTML in the URL and report on the total size (i.e., the app figures out the size of all of the JavaScript, images, etc. and adds that to the total). It should also report on the total number of requests that were required for this.
     * 
     */
    public static void main(String[] args) throws ScriptException, FileNotFoundException, NoSuchMethodException {
        // Create ScriptEngineManager and get a ScriptEngine from the manager
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("nashorn");
        // evaluate JavaScript code
        engine.eval(new FileReader("downloadSize3.js"));
    }
    
}

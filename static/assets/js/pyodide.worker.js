/* eslint-disable */
/* REPLACE THIS LINK WITH A FAST LINK TO PYODIDE FILES TO IMROVE LOAD SPEEDS. */
self.languagePluginUrl = "https://pyodide.cdn.iodide.io/";

/* Load pyodide */
self.importScripts(self.languagePluginUrl + "/pyodide.js");

var onmessage = function(e) {
  // eslint-disable-line no-unused-vars
  languagePluginLoader
    .then(() => {
      const data = e.data;
      const keys = Object.keys(data);
      for (let key of keys) {
        if (key !== "python") {
          // Keys other than python must be arguments for the python script.
          // Set them on self, so that `from js import key` works.
          self[key] = data[key];
        }
      }
      self.pyodide
        .runPythonAsync(data.python, () => {})
        .then(() => {
          result = self.pyodide.runPython("sys.stdout.getvalue()");
          self.pyodide.runPython("sys.stdout.truncate(0); sys.stdout.seek(0)");
          self.postMessage({ result: JSON.stringify(result), res: pyodide.globals.res });
        })
        .catch(err => {
          self.postMessage({ error: err.message });
        });
    })
    .catch(error => {
      self.postMessage({ error: error.message });
    });
};

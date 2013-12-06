/**
 * JSONP-sec uses spawned web workers to
 * insulate the current UI thread and DOM
 * from potential attacks from JSONP requests.
 * This is not meant to be a replacement for
 * a reasonable CORS setup, only when you do
 * not have access to the server returning data.
 */
(function(global) {

	/**
	 * Make a secure JSONP request, within the context of the web worker thread.
	 * This will use importScripts, so you must have a solution defined in the
	 * degraded iframe state that works with traditional JSONP <script> tags.
	 * @param {Object} options The options to use
	 * @param {String} options.url The url for the request
	 * @param {String} options.callbackParam The name of the callback function (will be executed in the global scope)
	 * @param {Function} callback The callback to respond to
	 * @return {Null}
	 */
	var JSONPsec = operative(function(options, callback) {
		var url, script,
			callbackParam = 'callback';

			// Bail if we have no options
			if (!(options && options.url)) {
				throw new Error('Need options and options.url defined');
			}

			// Set up options for the request
			url = options.url;
			callbackParam = options.callbackParam || callbackParam;

			// Set up callback param and create the script tag
			url += (url.indexOf('?') !== -1 && '&' || '?') + callbackParam + '=cb';

			// Set callback
			this[callbackParam] = callback;

			// Define importScripts for the degraded experience
			if (!importScripts) {
				this.importScripts = function(url) {
					var doc = document.body || document.documentElement,
						script = document.createElement('script');
					script.async = true;
					script.src = url;
					doc.appendChild(script);
				};
			}

			// Make the request
			importScripts(url);
		});

	// Expose the api
	if (typeof define !== 'undefined' && define.amd) {
		define([], function() {
			return JSONPsec;
		});
	}
	else {
		global.JSONPsec = JSONPsec;
	}

}(this));

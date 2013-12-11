/**
 * JSONP-sec uses spawned web workers to
 * insulate the current UI thread and DOM
 * from potential attacks from JSONP requests.
 * This is not meant to be a replacement for
 * a reasonable CORS setup, only when you do
 * not have access to the server returning data.
 * @module JSONPsec
 * @class JSONPsec
 */
(function(global) {

	/**
	 * Make a secure JSONP request, within the context of the web worker thread.
	 * This will use importScripts, so you must have a solution defined in the
	 * degraded iframe state that works with traditional JSONP <script> tags.
	 */
	var JSONPsec = operative(

		/**
		 * @method JSONPsec
		 * @param {Object} options The options to use
		 * @param {String} options.url The url for the request
		 * @param {String} [options.callbackParam=callback] The name of the callback function (will be executed in the global scope)
		 * @param {Function} callback The callback to respond to
		 * @return {Null} No data to return, the callback will receive the response
		 * @static
		 */
		function(options, callback) {
			var url, script,
				cbParam = 'callback';

			// Bail if we have no options
			if (!(options && options.url)) {
				throw new Error('Need options and options.url defined');
			}

			// Set up options for the request
			url = options.url;
			cbParam = options.callbackParam || cbParam;

			// Set up callback param and create the script tag
			url += (url.indexOf('?') !== -1 && '&' || '?') + cbParam + '=_' + cbParam;

			// Set callback
			this['_' + cbParam] = callback;

			// Make the request
			try {
				importScripts(url);
			}
			// Append script in the degraded experience
			catch (err) {
				(function(url) {
					var doc = document.body || document.documentElement,
						script = document.createElement('script');
					script.async = true;
					script.src = url;
					document.domain = document.domain;
					doc.appendChild(script);
				}(url));
			}
		}

	);

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

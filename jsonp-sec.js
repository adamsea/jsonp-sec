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
	 * Make a secure JSONP request.
	 * @param {Object} options The options to use
	 * @param {String} options.url The url for the request
	 * @param {String} options.callbackParam The name of the callback function (will be executed in the global scope)
	 * @param {Function} options.success The success handler
	 * @param {Function} options.error The error handler
	 * @return {Null}
	 */
	var JSONPsec = function(options) {
		var url, script,
			callbackParam = 'callback',
			success = function() {},
			error = function() {};

			// Bail if we have no options
			if (!(options && options.url)) {
				throw new Error('Need options and options.url defined');
			}

			// Set up options for the request
			url = options.url;
			callbackParam = options.callbackParam || callbackParam;
			success = (typeof options.success === 'function') && options.success || success;
			error = (typeof options.error === 'function') && options.error || error;

			// Set up callback param and create the script tag
			url += (url.indexOf('?') !== -1 && '&' || '?') + callbackParam + '=cb';
			script = document.createElement('script');
			script.src = url;
			script.async = true;

			// Set callback
			global[callbackParam] = success;

			// Make the request
			document.documentElement.appendChild(script);
		};

	global.JSONPsec = JSONPsec;

}(this));

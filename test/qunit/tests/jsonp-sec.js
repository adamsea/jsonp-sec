(function() {

	module("Tests for jsonp-sec");

	/**
	 * Test JSONPsec no callback for operative
	 */
	test("Test JSONPsec no callback for operative", 1, function() {
		try {
			JSONPsec();
		}
		catch(err) {
			ok(/operative/i.test(err));
		}
	});

	/**
	 * Test JSONPsec without sufficient options
	 */
	test("Test JSONPsec no options", function() {
		throws(JSONPsec(null, function(){}), 'Need options and options.url defined', 'No options throws an error');
		throws(JSONPsec({}, function(){}), 'Need options and options.url defined', 'No options throws an error');
	});

}());

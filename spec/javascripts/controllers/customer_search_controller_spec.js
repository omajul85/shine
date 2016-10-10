describe("CustomerSearchController", function() {
	describe("Initialization", function() {
		
		// Set up for the tests
		var scope = null, controller = null;

		// So our app is always loaded
		beforeEach(module("customers"));

		beforeEach(inject(function($controller, $rootScope) {
			scope = $rootScope.$new();
			controller = $controller("CustomerSearchController", 
				{ "$scope": scope }
			);
		}));

		// Tests below

		it("defaults to an empty customer list", function() {
			expect(scope.customers).toEqualData([]);
		});

	});

	describe("Fetching Search Results", function() {

		// Set up for the tests
		var scope = null, controller = null, httpBackend = null;
		var serverResults = [
			{
				id: 123,
				first_name: "Bob",
				last_name: "Jones",
				email: "bjones@foo.net",
				username: "jonesy"
			},
			{
				id: 456,
				first_name: "Bob",
				last_name: "Johnsons",
				email: "johnboy@bar.info",
				username: "bobbyj"
			}
		];

		beforeEach(module("customers"));

		beforeEach(inject(function($controller, $rootScope, $httpBackend) {
			scope = $rootScope.$new();
			httpBackend = $httpBackend;
			controller = $controller("CustomerSearchController", 
				{ "$scope": scope }
			);
		}));

		beforeEach(function() {
			httpBackend.when('GET', '/customers.json?keywords=bob&page=0').respond(serverResults);			
		});

		// Tests below

		it("populates the customer list with the results", function() {
			scope.search("bob");
			// flush calls the httpBackend function
			httpBackend.flush();
			expect(scope.customers).toEqualData(serverResults);
		});
	});

	describe("Error Handling", function() {

		// Set up for the tests
		var scope = null, controller = null, httpBackend = null;
		
		beforeEach(module("customers"));

		beforeEach(inject(function($controller, $rootScope, $httpBackend) {
			scope = $rootScope.$new();
			httpBackend = $httpBackend;
			controller = $controller("CustomerSearchController", 
				{ "$scope": scope }
			);
		}));

		beforeEach(function() {
			httpBackend.when('GET','/customers.json?keywords=bob&page=0').
				respond(500,'Internal Server Error');
			spyOn(window, "alert");	
		});
		
		// Tests below

		it("alerts the user on an error", function() {
			scope.search("bob");
			httpBackend.flush();
			expect(scope.customers).toEqualData([]);
			expect(window.alert).toHaveBeenCalledWith("There was a problem: 500");
		});

	});
});
describe("CustomerDetailController", function() {
	describe("Initialization", function() {
		
		// Set up for the tests (boilerplate)
		var scope = null, controller = null, id = 69, httpBackend = null;
		var customer = {
			id: id,
			first_name: "Bob",
			last_name: "Jones",
			username: "bob.jones",
			email: "bobbyj@somewhere.net",
			created_at: "2014-01-03T11:12:34"
		};

		// So our app is always loaded
		beforeEach(module("customers"));

		beforeEach(inject(function($controller, $rootScope, $routeParams, $httpBackend) {
			scope = $rootScope.$new();
			httpBackend = $httpBackend;
			$routeParams.id = id;
			httpBackend.when('GET','/customers/' + id + '.json').respond(customer);
			controller = $controller("CustomerDetailController", 
				{ "$scope": scope }
			);
		}));

		// Tests below

		it("fetches the customer from the backend", function() {
			httpBackend.flush();
			expect(scope.customer).toEqualData(customer);
		});

	});
});
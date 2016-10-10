require 'rails_helper'

feature "Customer Search" do
	def create_customer(first_name: nil, last_name: nil, email: nil)
		first_name ||= Faker::Name.first_name
		last_name ||= Faker::Name.last_name
		username = "#{Faker::Internet.user_name}#{rand(1000)}"
		email ||=  username + "@#{Faker::Internet.domain_name}"

		Customer.create!(
			first_name: first_name,
			last_name: last_name,
			username: username,
			email: email
			)
	end

	let(:email) { "bob@example.com" }
	let(:password) { "00000000" }

	before do
		User.create!(email: email, password: password, password_confirmation: password)

		create_customer first_name: "Robert", last_name: "Aaron"
		create_customer first_name: "Bob", last_name: "Johnson"
		create_customer first_name: "JR", last_name: "Bob"
		create_customer first_name: "Bobby", last_name: "Dobbs"
		create_customer first_name: "Bob", last_name: "Jones", email: "bob123@somewhere.net"

		visit "/customers"
		
		# Log in
		fill_in "Email", with: email
		fill_in "Password", with: password
		click_button "Log in"
	end

	scenario "Search by Name" do
		
		within "section.search-form" do 
			fill_in "keywords", with: "bob"
		end
		
		within "section.search-results" do
			expect(page).to have_content("Results")
			expect(page.all("ol li.list-group-item").count).to eq(4)
			# save_screenshot("/home/omajul/Pictures/Shine/img.png")
			expect(page.all("ol li.list-group-item")[0]).to have_content("JR Bob")
			expect(page.all("ol li.list-group-item")[3]).to have_content("Bob Jones")
		end
	end

	scenario "Search by Email" do
		
		within "section.search-form" do 
			fill_in "keywords", with: "bob123@somewhere.net"
		end
		
		within "section.search-results" do
			puts page.html
			# save_screenshot("/home/omajul/Pictures/Shine/img.png")
			expect(page).to have_content("Results")
			expect(page.all("ol li.list-group-item").count).to eq(4)
			expect(page.all("ol li.list-group-item")[0]).to have_content("Bob Jones")
			expect(page.all("ol li.list-group-item")[1]).to have_content("JR Bob")
			expect(page.all("ol li.list-group-item")[2]).to have_content("Bobby Dobbs")
			expect(page.all("ol li.list-group-item")[3]).to have_content("Bob Johnson")
		end
	end

end
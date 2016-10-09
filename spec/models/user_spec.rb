require 'rails_helper'
require 'support/violate_check_constraint_matcher'

describe User do
	describe "Email:" do
		let(:user) do
			User.create!(
				email: "toto@example.com",
				password: "AZERTYUI",
				password_confirmation: "AZERTYUI"
			)
		end

		it "absolutely prevents invalid email addresses" do
			expect { 
				user.update_attribute(:email, "toto@toto.com")
			}.to violate_check_constraint(:email_must_be_company_email)
		end
	end
end

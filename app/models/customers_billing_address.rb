class CustomersBillingAddress < ApplicationRecord
	belongs_to :address
	belongs_to :customer
end

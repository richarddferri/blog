class ExampleUser
	attr_accessor :name, :email

	def initialize( a = {} )
		@name 	= 	a[:name]
		@email 	= 	a[:email]
	end
	def formatted_email
		"#{@name} <#{@email}>"
	end
end
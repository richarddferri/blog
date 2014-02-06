require 'spec_helper'
describe "Users Pages" do
  describe "signup page" do
  	before{visit signup_path}
  	it{page.should have_selector('h1', text: 'Sign up')}
   	it{page.should have_selector('title', text: full_title('Sign Up'))}
  end
end
describe "Static pages Integration" do
	describe "Home page Integration" do
		before{
			visit root_path
		}
		it {page.should have_title(full_title('Home'))}
		 
 	end
 	describe "Help page" do
 		before{
 			visit help_path
 		}
		it {page.should have_title(full_title('Help'))}
		
 	end
 	describe "About Us page" do
 		before{
 			visit about_path
 		}
		it {	page.should have_title(full_title('About Us'))}

 	end
 	describe "Contact page" do
 		before{
 			visit contact_path
 		}
 		it{page.should have_title(full_title('Contact'))}
 	end
 	describe "Sign up page" do
 		before{
 			visit sign_up_path
 		}
 		it{page.should have_title(full_title('Sign Up'))}
 	end
  # describe "GET /static_pages" do
  #   it "works! (now write some real specs)" do
  #     # Run the generator again with the --webrat flag if you want to use webrat methods/matchers
  #     get home
  #     response.status.should be(200)
  #   end
  # end
end

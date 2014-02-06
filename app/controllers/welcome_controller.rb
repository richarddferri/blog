class WelcomeController < ApplicationController
  def index
  end
  def signup
  		redirect_to sign_up_path
  end
end

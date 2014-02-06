class Microblog < ActiveRecord::Base
		validates :content, :length => { :maximum=>256}
		belongs_to :user
end

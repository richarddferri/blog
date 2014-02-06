class PostsController < ApplicationController
	def new 
	end
	def create
		@post = Post.new(post_params)
		@post.save
		puts "*********YAML REPRESENTATION *********"
		puts @post.to_yaml
		redirect_to @post
	end
	private
	def post_params
		params.require(:post).permit(:title,:text)
	end
	def show
		puts "*********SHOW*********"
		@post = Post.find(params[:id])
	end
end

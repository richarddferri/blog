Blog::Application.routes.draw do
  # get "users/new"
  root :to => 'static_pages#home'
  get '/help' ,    to: 'static_pages#help'
  get '/about' ,   to: 'static_pages#about'
  get '/contact' , to: 'static_pages#contact'
  get '/home' , to: 'static_pages#home'
  get '/sign_up' , to: 'static_pages#sign_up'
  get '/sign_in' , to: 'static_pages#sign_in'
  get '/user_home' , to: 'static_pages#user_home'
  get '/signup' , to: 'welcome#signup'
  get '/add_scene' , to: 'static_pages#add_scene'
  # get '/' , to: 'welcome/sign_up'
  # get "static_pages/home"
  # get "static_pages/help"
  # get "static_pages/about"
  # get "static_pages/contact"
  # resources :microblogs

  # resources :users

  # resources :microposts

  # resources :posts

  # get "welcome/index"
  # root "welcome#index"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end

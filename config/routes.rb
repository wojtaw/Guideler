Guideler::Application.routes.draw do

  #devise_for :users, :path => "account", :skip => [:registrations, :sessions], :path_names => { :sign_in => 'login', :sign_out => 'logout', :password => 'secret', :confirmation => 'verification', :unlock => 'unblock', :sign_up => 'register' }

  devise_for :users, :path => '', :skip => [:sessions], :path_names => { :sign_up => 'signup' }

  as :user do
    get 'login' => 'devise/sessions#new', :as => :new_user_session
    post 'login' => 'devise/sessions#create', :as => :user_session
    delete 'logout' => 'devise/sessions#destroy', :as => :destroy_user_session

    get 'password/reset' => 'devise/password#new', :as => :new_user_password
  end

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
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

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
  root :to => 'home#index'

  guider_regexp = /[0-9\-]+/

  #general, playing
  match 'g/:guiderID' => 'guider#player', :as => 'g', :constraints => { :guiderID => guider_regexp }

  #Management
  match 'edit/:guiderID' => 'guider#editor', :as => 'editor', :constraints => { :guiderID => guider_regexp }
  match 'my_guiders' => 'guider#manage_all', :as => 'manage_all'
  match 'new_guider' => 'guider#new_guider', :as => 'new_guider'
  match 'delete_guider' => 'guider#delete_guider', :as => 'delete_guider'
  match 'me' => 'guider#display_profile', :as => 'display_profile'

  #Technical, API
  match 'api/get_guider_info/:guiderID' => 'guider#guiderJSON', :as => 'api_get_info', :constraints => { :guiderID => guider_regexp }
  match 'api/edit_guider' => 'guider#api_edit_guider', :as => 'api_edit_guider', :constraints => { :guiderID => guider_regexp }

  #Error pages
  match 'error/:error_code' => 'error#show_general_error', :as => 'show_general_error'

  #explore page
  match 'explore' => 'guider#explore_guiders', :as => 'explore_guiders'
end

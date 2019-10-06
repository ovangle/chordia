Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace 'api' do
    resources :artists, only: [:index, :show];
    resources :songs
  end

  match'*path', to: 'angular#index', via: [:get]
end

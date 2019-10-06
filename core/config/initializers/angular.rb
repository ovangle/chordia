
Rails.application.config.to_prepare do
  home = ENV.fetch('HOME')

  AngularController.ng_root = "#{home}/Development/chordia/web/dist/web"
end

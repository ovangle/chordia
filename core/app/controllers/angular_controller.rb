
class AngularController < ActionController::Base
  protect_from_forgery except: :index

  class_attribute :ng_root

  def self.angular_loader
    AngularLoader.new(self.ng_root)
  end

  def index
    ng_loader = self.class.angular_loader

    unless ng_loader.valid?
      render body: ng_loader.errors,
             status: :internal_server_error and return
    end

    path = request.fullpath

    case path
    when /.*\.\w+$/
      if ng_loader.asset_exists?(path)
        render body: ng_loader.load_asset(path).read,
               content_type: Marcel::MimeType.for(name: path),
               status: :ok
      else
        render body: 'Not found',
               status: :not_found

      end
    else
      # For any path without an extension, serve the index.html of the angular project
      render file: ng_loader.index_path,
             mime_type: 'text/html',
             status: :ok
    end
  end

  class AngularLoader
    def initialize(ng_root)
      @ng_root = ng_root
    end

    def index_path
      [@ng_root, 'index.html'].join('/')
    end

    # Absolute path to an angular build asset, specified relative to ng_root
    def asset_path(file_path)
      [@ng_root, file_path].join('/')
    end

    def asset_exists?(file_path)
      File.exists?(asset_path(file_path))
    end

    def load_asset(file_path)
      File.open(asset_path(file_path))
    end

    def valid?
      File.exists?(index_path)
    end

    def errors
      unless valid?
        warn "INVALD NG_ROOT #{@ng_root}"
        {ng_root: 'Invalid angular loader configuration. NG_ROOT is not an angular build directory.'}
      end
    end
  end
end

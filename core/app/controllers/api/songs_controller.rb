require 'ultimate-guitar'

module Api

  class SongsController < ApplicationController
    skip_before_action :verify_authenticity_token

    def create
      @song = Song.new artist_id: params["artist_id"],
                       name: params["name"],
                       href: params["href"]

      scraper = UltimateGuitarScraper.new @song.href
      @song.tab = scraper.tab_content
      @song.save


      render json: @song.as_json
    end

    def show
      song = Song.find(params["id"])


      respond_to do |format|
        format.json { render json: song.as_json }
      end
    end

    def index
      songs = Song.all

      respond_to do |format|
        format.json { render json: {items: songs.map {|s| s.as_json(minimal: true)}} }
      end
    end
  end
end
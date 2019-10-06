require 'ultimate-guitar'

class SongsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    puts "PARAMS #{params}"
    @song = Song.new artist_id: params["artist_id"],
                     name: params["name"],
                     href: params["href"]

    scraper = UltimateGuitarScraper.new @song.href
    @song.tab = scraper.tab_content
    @song.save

    render @song
  end

  def show
    puts "PARAMS #{params}"
    song = Song.find(params["id"])


    respond_to do |format|
      format.json { render json: song.as_json }
    end
  end
end


class Song < ApplicationRecord
  belongs_to :artist


  def as_json
    json = super
    json["artist_id"] = artist.id
    json["artist_name"] = artist.name
    json
  end
end
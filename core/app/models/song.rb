class Song < ApplicationRecord
  belongs_to :artist


  def as_json(options = {})
    if options[:minimal]
      {
        "id" => self.id,
        "artist_id" => artist.id,
        "artist_name" => artist.name,
        "name" => self.name
      }
    else
      json = super
      json["artist_id"] = artist.id
      json["artist_name"] = artist.name
      json
    end
  end
end
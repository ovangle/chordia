class CreateArtists < ActiveRecord::Migration[5.2]
  def change
    create_table :artists do |t|
      t.string 'name'
      t.timestamps
    end

    create_table :songs do |t|
      t.references :artist
      t.string :name

      t.string :href
      t.text :tab

      t.timestamps
    end
  end
end

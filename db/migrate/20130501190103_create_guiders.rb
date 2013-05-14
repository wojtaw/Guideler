class CreateGuiders < ActiveRecord::Migration
  def change
    create_table :guiders do |t|
      t.string :name
      t.text :description

      t.timestamps
    end
  end
end

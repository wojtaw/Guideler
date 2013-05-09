class AddPublishedToGuiders < ActiveRecord::Migration
  def up
    change_table :guiders do |t|
      t.boolean :published, :default => false
    end
    Guider.update_all ["published = ?", false]
  end

  def down
    remove_column :guiders, :published
  end
end

-- Run once in the Supabase SQL editor to point existing species rows at the new images (matches seed.sql).
update species as s set image = v.image
from (values
  ('Cavia porcellus', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Guinea_pig_2011_01_10_12_58_15.jpg/500px-Guinea_pig_2011_01_10_12_58_15.jpg'),
  ('Opuntia ficus-indica', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Dikenli_%C4%B0ncir_%28Opuntia_ficus-indica%29_Gaziantep_Turkey.IMG_1104.jpg/500px-Dikenli_%C4%B0ncir_%28Opuntia_ficus-indica%29_Gaziantep_Turkey.IMG_1104.jpg'),
  ('Odontodactylus scyllarus', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Odontodactylus_scyllarus_R%C3%A9union.jpg/500px-Odontodactylus_scyllarus_R%C3%A9union.jpg'),
  ('Glaucus atlanticus', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/Glaucus_atlanticus_1_cropped.jpg/500px-Glaucus_atlanticus_1_cropped.jpg'),
  ('Leuresthes tenuis', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e9/Leuresthes_tenuis.jpg/500px-Leuresthes_tenuis.jpg'),
  ('Cyanocitta stelleri', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Steller%27s_Jay_flagstaff_arizona.jpg/500px-Steller%27s_Jay_flagstaff_arizona.jpg'),
  ('Grimpoteuthis', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c1/Grimpoteuthis_2108m.jpg/500px-Grimpoteuthis_2108m.jpg'),
  ('Homo Sapiens', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/A_Man_on_the_Moon%2C_AS11-40-5903_%28cropped%29.jpg/500px-A_Man_on_the_Moon%2C_AS11-40-5903_%28cropped%29.jpg'),
  ('Ursus maritimus', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Polar_Bear_ANWR_10.jpg/500px-Polar_Bear_ANWR_10.jpg'),
  ('Panthera uncia', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/35/Lightmatter_snowleopard.jpg/500px-Lightmatter_snowleopard.jpg'),
  ('Panthera leo', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a6/020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg/500px-020_The_lion_king_Snyggve_in_the_Serengeti_National_Park_Photo_by_Giles_Laurent.jpg'),
  ('Ailuropoda melanoleuca', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/500px-Grosser_Panda.JPG'),
  ('Panthera ', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg/500px-Bengal_tiger_%28Panthera_tigris_tigris%29_female_3_crop.jpg'),
  ('Psychrolutes marcidus', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/15/Psychrolutes_marcidus.jpg/500px-Psychrolutes_marcidus.jpg'),
  ('Giraffa', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/500px-Giraffe_Mikumi_National_Park.jpg'),
  ('Folivora', 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Bicho-pregui%C3%A7a_3.jpg/500px-Bicho-pregui%C3%A7a_3.jpg')
) as v(scientific_name, image)
where s.scientific_name = v.scientific_name;

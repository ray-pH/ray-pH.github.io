import openmc

## ================================ materials
uo2 = openmc.Material(1, "uo2")
uo2.add_nuclide('U235', 0.03)
uo2.add_nuclide('U238', 0.97)
uo2.add_nuclide('O16', 2.0)
uo2.set_density('g/cm3', 10.0)

zirconium = openmc.Material(name="zirconium")
zirconium.add_element('Zr', 1.0)
zirconium.set_density('g/cm3', 6.6)

water = openmc.Material(name="h2o")
water.add_nuclide('H1', 2.0)
water.add_nuclide('O16', 1.0)
water.set_density('g/cm3', 1.0)
water.add_s_alpha_beta('c_H_in_H2O')

materials = openmc.Materials([uo2, zirconium, water])
materials.export_to_xml()


## ================================ geometry
fuel_outer_radius = openmc.ZCylinder(r=0.39)
clad_inner_radius = openmc.ZCylinder(r=0.40)
clad_outer_radius = openmc.ZCylinder(r=0.46)

fuel_region = -fuel_outer_radius
gap_region = +fuel_outer_radius & -clad_inner_radius
clad_region = +clad_inner_radius & -clad_outer_radius

fuel_cell = openmc.Cell(name='fuel', fill=uo2, region=fuel_region)
gap_cell = openmc.Cell(name='air gap', region=gap_region) #fill void by default
clad_cell = openmc.Cell(name='clad', fill=zirconium, region=clad_region)

pitch = 1.26
left = openmc.XPlane(-pitch/2, boundary_type='reflective')
right = openmc.XPlane(pitch/2, boundary_type='reflective')
bottom = openmc.YPlane(-pitch/2, boundary_type='reflective')
top = openmc.YPlane(pitch/2, boundary_type='reflective')
water_region = +left & -right & +bottom & -top & +clad_outer_radius

moderator_cell = openmc.Cell(name='moderator', fill=water, region=water_region)

root_universe = openmc.Universe(cells=(fuel_cell, gap_cell, clad_cell, moderator_cell))
geometry = openmc.Geometry(root_universe)
geometry.export_to_xml()

## ================================ plotting
matcolors = {
    uo2 :      (0xE3,0xE3,0x00),   # yellow (E3E300)
    zirconium: (0x23,0x23,0x23),   # grey   (232323)
    water:     (0x00,0x00,0xFF),   # blue   (0000FF)
}
plot = openmc.Plot()
plot.filename = 'img'
plot.basis = 'xy'
plot.width = (pitch, pitch)
plot.pixels = (500, 500)
plot.origin = (0,0,0)
plot.color_by = 'material'
plot.colors = matcolors
plot.show_overlaps = True

plots = openmc.Plots([plot])
plots.export_to_xml()
openmc.plot_geometry()


## ================================ settings
point = openmc.stats.Point((0, 0, 0))
source = openmc.Source(space=point)

settings = openmc.Settings()
settings.source = source
settings.batches = 100
settings.inactive = 10
settings.particles = 1000

settings.export_to_xml()

## ================================ running
openmc.run()

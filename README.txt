SPACELIKE
=========

A simple space piloting game in WebGL.  Intended as an extended lesson on http://learningwebgl.com/


By Giles Thomas, giles@giles.net

Released under a Creative Commons Attribution-Share Alike 2.0 UK: England & Wales License
See here for details: http://creativecommons.org/licenses/by-sa/2.0/uk/

If you modify the spacecraft model in Blender, the process for exporting it is a bit 
manual (and will be improved, honest :-):

- Select the spacecraft from the Blender 3D view
- Export to Wavefront (.obj) format, with the following settings:
    - Context: Selection only
    - Output options: apply modifiers, rotate x90 and copy images off
    - Export: edges off, triangulate on, materials off, uvs off, normals on, hq on, polygroups off, nurbs off, objects off, groups off, material groups off, keep vert order on
- Run the JavaScript conversion program by opening the file ObjToJSON.html in a browser
- Copy the content in the browser page, and paste it to spacecraft.json

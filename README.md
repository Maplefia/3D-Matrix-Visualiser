# 3D Matrix Visualiser

A simple visualiser tool to see the effects of repeated 3x3 matrix applications for a selected matrix. Will also display determinant, eigenvectors and eigenvalues. 

This was mostly started as I struggle to picture them, and we are covering linear algebra in uni right now so kinda useful i guess?

## To run

It's a Vite React project - install the node modules with: 
```bash
npm install
```
Then run with:
```bash
npm run dev
```

## Some features

-  You can select a matrix yourself, or pick from preselected ones: Scale, Rotation, Shear, Mixed or Identity.
-  A point cloud is set up with presets of: Circle, Square, Cube and Sphere to help you visualise the effects of the matrix.
-  You can click on a point to track where it goes - coordinates are displayed in log in the bottom left.
-  The 2D plane can be toggled on or off depending on how you feel
-  Eigenvectors can also be toggled on or off. Note complex (magenta) eigenvectors will not be shown.
-  To play the transformations - either use the step button or the animate button, which oscillates through iterations 0 to 9.

<img width="1457" height="820" alt="UI and cube" src="https://github.com/user-attachments/assets/d9d37bb1-a7d2-4ec1-a317-68bddb4c2b99" />



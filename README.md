# <img src="https://raw.githubusercontent.com/cttricks/pixlab/refs/heads/master/assets/icons/favicon-32x32.png"> ix Lab

PixLab is a weekend side project dedicated to enhancing my development skills while having fun along the way. The first tool in the PixLab suite, **PixLab - Image Resizer**, allows users to effortlessly resize images with just a few clicks. As I continue to grow and experiment, I plan to add more exciting tools to the PixLab collection, making it a comprehensive resource for various image manipulation tasks.

## Pix Lab - Image Resizer
<img src="https://repository-images.githubusercontent.com/871228452/9e3ba57e-2299-4bef-acb0-f04ed73f8223">

A free, open-source tool designed to help you resize single or multiple images with ease. It uses Pica.js for high-quality, GPU-accelerated image resizing, and offers various options for adjusting image export settings. You can download resized images as a ZIP file for convenience.

[Click here](https://pixlab.cttricks.com) to experience the tool in action!

### Features
- Resize Images: Upload and resize one or more images simultaneously with great quality.
- Adjustable Settings: Set image quality, format (JPG/PNG), and background color (for transparent images).
- Batch Downloads: Download resized images in bulk as a ZIP file.
- Free & Open Source: Completely free to use, and you can contribute or customize the tool as needed.

### Technology Stack
- Pica.js: GPU-powered image resizing.
- JSZip: Bundles multiple images into a zip file.
- FileSaver.js: Enables easy file download handling.

### How to Use
- Upload your images by dragging and dropping or selecting them from your device.
- Adjust the export settings as needed (quality, format, background, etc.).
- Click "Resize" to process the images.
- Download the resized images in a ZIP file.

## Installation (For Local Development)
To get started with PixLab, make sure you have the Live Server extension installed in Visual Studio Code. This extension allows you to run the project easily and see the changes in real time.

Once you have the Live Server extension installed, follow these steps to set up and run the tool locally:

```bash
// Step 1: Clone this repository
git clone https://github.com/cttricks/pixlab.git pixlab

// Step 2: Navigate into the project directory
cd pixlab

// Step 3: Open the project in Visual Studio Code
code .
```

Now open the `index.html` file in the editor, `right-click`, and select `Open with Live Server` to start using the tool in your browser.
# ACF Visual Editor Field

A custom ACF field type that provides a drag-and-drop visual editor.

## Features

- Drag & drop visual editor powered by GrapesJS

## Installation

1. Upload the `acf-visual-editor-field` folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Make sure ACF (Advanced Custom Fields) is installed and activated

## Usage

### Creating a Visual Editor Field

1. Go to **ACF → Field Groups**
2. Create or edit a field group
3. Add a new field and select **"Visual Editor"** as the field type
4. Set the editor height (default: 680px)
5. Assign the field group to your desired post type

### PHP Example

```php
<?php

$content = get_field('visual_editor_source');

if ($content) {
    echo $content;
}
```

### REST API Example (JavaScript)

```js
const SITE_URL = "http://localhost:3000"

async function fetchVisualEditorData(postId) {
    const apiEndpoint = `${SITE_URL}/wp-json/wp/v2/posts/${postId}`;

    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Render the content
        document.querySelector("body").innerHTML = data.acf.visual_editor_source.formatted_value;
        
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Example usage
fetchVisualEditorData(123); // Enter your Post ID
```

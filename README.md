# Overview

ACF GrapesJS Field A custom Advanced Custom Fields (ACF) field type that integrates the GrapesJS visual editor. Use it to build and edit content visually with drag-and-drop components, and store the resulting HTML/CSS in your post meta.

# Example

## Fetch API data

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
fetchVisualEditorData(40); // Enter your Post ID
```
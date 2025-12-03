/**
 * JavaScript for the Visual Editor ACF field type using GrapesJS.
 */
(function($) {
	// Store editor instances
	var editors = {};

	function initialize_field($field) {
		var $wrap = $field.find('.acf-grapesjs-wrap');
		
		if ($wrap.length === 0) {
			return;
		}

		var $editorContainer = $wrap.find('.gjs-editor');
		var $storage = $wrap.find('.gjs-storage');
		var editorId = $editorContainer.attr('id');
		
		if (!editorId || editors[editorId]) {
			return;
		}

		// Get initial content from textarea and parse it
		var rawContent = $storage.val() || '';
		var initialHtml = '';
		var initialCss = '';
		
		var initialCustomCss = '';
		
		// Try to parse as JSON first (new format)
		try {
			var parsed = JSON.parse(rawContent);
			if (parsed.html !== undefined) {
				initialHtml = parsed.html || '';
				initialCss = parsed.css || '';
				initialCustomCss = parsed.customCss || '';
			}
		} catch(e) {
			// Not JSON, try to extract style tags (legacy format)
			var styleMatch = rawContent.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
			if (styleMatch) {
				styleMatch.forEach(function(style) {
					var cssContent = style.replace(/<\/?style[^>]*>/gi, '');
					initialCss += cssContent;
				});
				initialHtml = rawContent.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
			} else {
				initialHtml = rawContent;
			}
		}
		
		// Custom CSS textarea
		var $customCssTextarea = $wrap.find('.gjs-custom-css-textarea');
		$customCssTextarea.val(initialCustomCss);

		// Initialize GrapesJS
		var editor = grapesjs.init({
			container: '#' + editorId,
			height: '100%',
			width: 'auto',
			storageManager: false,
			components: initialHtml,
			style: initialCss,
			// Use div wrapper instead of body
			wrapperIsBody: false,
			canvas: {
				styles: []
			},
			plugins: [],
			pluginsOpts: {},
			blockManager: {
				appendTo: '#' + editorId + '-blocks',
				blocks: [
					// ============ BASIC ============
					{
						id: 'text',
						label: 'Text',
						category: 'Basic',
						content: '<div data-gjs-type="text">Insert your text here</div>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z"/></svg>'
					},
					{
						id: 'h1',
						label: 'Heading 1',
						category: 'Basic',
						content: '<h1>Heading 1</h1>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M14,18V16H16V6.31L13.5,7.75V5.44L16,4H18V16H20V18H14Z"/></svg>'
					},
					{
						id: 'h2',
						label: 'Heading 2',
						category: 'Basic',
						content: '<h2>Heading 2</h2>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M21,18H15A2,2 0 0,1 13,16C13,15.47 13.2,15 13.54,14.64L18.41,9.41C18.78,9.05 19,8.55 19,8A2,2 0 0,0 17,6A2,2 0 0,0 15,8H13A4,4 0 0,1 17,4A4,4 0 0,1 21,8C21,9.1 20.55,10.1 19.83,10.83L15,16H21V18Z"/></svg>'
					},
					{
						id: 'h3',
						label: 'Heading 3',
						category: 'Basic',
						content: '<h3>Heading 3</h3>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,4H5V10H9V4H11V18H9V12H5V18H3V4M15,4H19A2,2 0 0,1 21,6V16A2,2 0 0,1 19,18H15A2,2 0 0,1 13,16V15H15V16H19V12H15V10H19V6H15V7H13V6A2,2 0 0,1 15,4Z"/></svg>'
					},
					{
						id: 'paragraph',
						label: 'Paragraph',
						category: 'Basic',
						content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13,4A4,4 0 0,1 17,8A4,4 0 0,1 13,12H11V18H9V4H13M13,10A2,2 0 0,0 15,8A2,2 0 0,0 13,6H11V10H13Z"/></svg>'
					},
					{
						id: 'link',
						label: 'Link',
						category: 'Basic',
						content: '<a href="#">Click here</a>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z"/></svg>'
					},
					{
						id: 'image',
						label: 'Image',
						category: 'Basic',
						select: true,
						content: { type: 'image' },
						activate: true,
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/></svg>'
					},
					{
						id: 'video',
						label: 'Video',
						category: 'Basic',
						select: true,
						content: { type: 'video' },
						activate: true,
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z"/></svg>'
					},

					// ============ LAYOUT ============
					{
						id: 'section',
						label: 'Section',
						category: 'Layout',
						content: '<section style="padding:40px 20px;"></section>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21,18H3V6H21M19,16V8H5V16H19Z"/></svg>'
					},
					{
						id: 'container',
						label: 'Container',
						category: 'Layout',
						content: '<div style="max-width:1200px;margin:0 auto;padding:0 15px;"></div>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"/></svg>'
					},
					{
						id: '1-column',
						label: '1 Column',
						category: 'Layout',
						content: '<div style="display:flex;padding:10px;"><div style="flex:1;min-height:75px;padding:10px;"></div></div>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>'
					},
					{
						id: '2-columns',
						label: '2 Columns',
						category: 'Layout',
						content: '<div style="display:flex;padding:10px;"><div style="flex:1;min-height:75px;padding:10px;"></div><div style="flex:1;min-height:75px;padding:10px;"></div></div>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-6V5h6v14zM5 5h6v14H5V5z"/></svg>'
					},
					{
						id: '3-columns',
						label: '3 Columns',
						category: 'Layout',
						content: '<div style="display:flex;padding:10px;"><div style="flex:1;min-height:75px;padding:10px;"></div><div style="flex:1;min-height:75px;padding:10px;"></div><div style="flex:1;min-height:75px;padding:10px;"></div></div>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16h-4V5h4v14zm-6 0h-2V5h2v14zM5 5h4v14H5V5z"/></svg>'
					},

					// ============ COMPONENTS ============
					{
						id: 'button',
						label: 'Button',
						category: 'Components',
						content: '<a href="#" style="display:inline-block;padding:12px 24px;background:#2271b1;color:#fff;text-decoration:none;border-radius:4px;">Click Me</a>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z"/></svg>'
					},
					{
						id: 'divider',
						label: 'Divider',
						category: 'Components',
						content: '<hr style="border:none;border-top:1px solid #ddd;margin:20px 0;"/>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,13H5V11H19V13Z"/></svg>'
					},
					{
						id: 'spacer',
						label: 'Spacer',
						category: 'Components',
						content: '<div style="height:50px;"></div>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"/></svg>'
					},
					{
						id: 'quote',
						label: 'Quote',
						category: 'Components',
						content: '<blockquote style="border-left:4px solid #2271b1;padding:20px;margin:20px 0;background:#f9f9f9;font-style:italic;">"Lorem ipsum dolor sit amet."<footer style="margin-top:10px;font-size:14px;font-style:normal;color:#666;">— Author</footer></blockquote>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z"/></svg>'
					},
					{
						id: 'list',
						label: 'List',
						category: 'Components',
						content: '<ul style="padding-left:20px;"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7,5H21V7H7V5M7,13V11H21V13H7M4,4.5A1.5,1.5 0 0,1 5.5,6A1.5,1.5 0 0,1 4,7.5A1.5,1.5 0 0,1 2.5,6A1.5,1.5 0 0,1 4,4.5M4,10.5A1.5,1.5 0 0,1 5.5,12A1.5,1.5 0 0,1 4,13.5A1.5,1.5 0 0,1 2.5,12A1.5,1.5 0 0,1 4,10.5M7,19V17H21V19H7M4,16.5A1.5,1.5 0 0,1 5.5,18A1.5,1.5 0 0,1 4,19.5A1.5,1.5 0 0,1 2.5,18A1.5,1.5 0 0,1 4,16.5Z"/></svg>'
					},
					{
						id: 'table',
						label: 'Table',
						category: 'Components',
						content: '<table style="width:100%;border-collapse:collapse;"><thead><tr><th style="padding:12px;border:1px solid #ddd;background:#f5f5f5;">Header 1</th><th style="padding:12px;border:1px solid #ddd;background:#f5f5f5;">Header 2</th></tr></thead><tbody><tr><td style="padding:12px;border:1px solid #ddd;">Cell 1</td><td style="padding:12px;border:1px solid #ddd;">Cell 2</td></tr></tbody></table>',
						media: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z"/></svg>'
					},

				]
			},
			layerManager: {
				appendTo: '#' + editorId + '-layers'
			},
			selectorManager: {
				appendTo: '#' + editorId + '-styles'
			},
			styleManager: {
				appendTo: '#' + editorId + '-styles',
				sectors: [
					{
						name: 'Layout',
						open: false,
						properties: [
							{
								name: 'Display',
								property: 'display',
								type: 'select',
								defaults: 'block',
								options: [
									{ id: 'block', label: 'Block' },
									{ id: 'inline-block', label: 'Inline Block' },
									{ id: 'flex', label: 'Flex' },
									{ id: 'grid', label: 'Grid' },
									{ id: 'none', label: 'None' }
								]
							},
							{
								name: 'Position',
								property: 'position',
								type: 'select',
								defaults: 'static',
								options: [
									{ id: 'static', label: 'Static' },
									{ id: 'relative', label: 'Relative' },
									{ id: 'absolute', label: 'Absolute' },
									{ id: 'fixed', label: 'Fixed' }
								]
							}
						]
					},
					{
						name: 'Flex',
						open: false,
						properties: [
							{
								name: 'Direction',
								property: 'flex-direction',
								type: 'select',
								defaults: 'row',
								options: [
									{ id: 'row', label: 'Row' },
									{ id: 'row-reverse', label: 'Row Reverse' },
									{ id: 'column', label: 'Column' },
									{ id: 'column-reverse', label: 'Column Reverse' }
								]
							},
							{
								name: 'Wrap',
								property: 'flex-wrap',
								type: 'select',
								defaults: 'nowrap',
								options: [
									{ id: 'nowrap', label: 'No Wrap' },
									{ id: 'wrap', label: 'Wrap' },
									{ id: 'wrap-reverse', label: 'Wrap Reverse' }
								]
							},
							{
								name: 'Justify',
								property: 'justify-content',
								type: 'select',
								defaults: 'flex-start',
								options: [
									{ id: 'flex-start', label: 'Start' },
									{ id: 'flex-end', label: 'End' },
									{ id: 'center', label: 'Center' },
									{ id: 'space-between', label: 'Space Between' },
									{ id: 'space-around', label: 'Space Around' },
									{ id: 'space-evenly', label: 'Space Evenly' }
								]
							},
							{
								name: 'Align Items',
								property: 'align-items',
								type: 'select',
								defaults: 'stretch',
								options: [
									{ id: 'flex-start', label: 'Start' },
									{ id: 'flex-end', label: 'End' },
									{ id: 'center', label: 'Center' },
									{ id: 'stretch', label: 'Stretch' },
									{ id: 'baseline', label: 'Baseline' }
								]
							},
							{
								name: 'Gap',
								property: 'gap',
								type: 'integer',
								units: ['px', 'em', 'rem', '%'],
								defaults: '0'
							},
							{
								name: 'Flex Grow',
								property: 'flex-grow',
								type: 'integer',
								defaults: '0',
								min: 0
							},
							{
								name: 'Flex Shrink',
								property: 'flex-shrink',
								type: 'integer',
								defaults: '1',
								min: 0
							},
							{
								name: 'Flex Basis',
								property: 'flex-basis',
								type: 'integer',
								units: ['px', '%', 'auto'],
								defaults: 'auto'
							}
						]
					},
					{
						name: 'Dimension',
						open: false,
						buildProps: ['width', 'height', 'max-width', 'min-width', 'min-height', 'margin', 'padding']
					},
					{
						name: 'Typography',
						open: false,
						buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align', 'text-transform']
					},
					{
						name: 'Decorations',
						open: false,
						buildProps: ['background-color', 'background', 'border-radius', 'border', 'box-shadow', 'opacity']
					}
				]
			},
			traitManager: {
				appendTo: '#' + editorId + '-traits'
			},
			panels: {
				defaults: []
			},
			deviceManager: {
				devices: [
					{ name: 'Desktop', width: '' },
					{ name: 'Tablet Landscape', width: '1199px', widthMedia: '1199px' },
					{ name: 'Tablet', width: '991px', widthMedia: '991px' },
					{ name: 'Mobile', width: '767px', widthMedia: '767px' }
				]
			}
		});

		// Custom toolbar buttons
		var $toolbar = $wrap.find('.gjs-custom-toolbar');
		var $deviceInfo = $toolbar.find('.gjs-device-info');
		
		// Device buttons
		$toolbar.find('[data-device]').on('click', function(e) {
			e.preventDefault();
			var device = $(this).data('device');
			editor.setDevice(device);
			$toolbar.find('[data-device]').removeClass('active');
			$(this).addClass('active');
			$deviceInfo.text(device);
		});
		
		// Custom fullscreen for entire editor
		var isFullscreen = false;
		function toggleFullscreen() {
			isFullscreen = !isFullscreen;
			if (isFullscreen) {
				$wrap.addClass('gjs-fullscreen-mode');
				$('body').addClass('gjs-editor-fullscreen');
			} else {
				$wrap.removeClass('gjs-fullscreen-mode');
				$('body').removeClass('gjs-editor-fullscreen');
			}
		}
		
		// ESC key to exit fullscreen
		$(document).on('keydown', function(e) {
			if (e.key === 'Escape' && isFullscreen) {
				toggleFullscreen();
				$toolbar.find('[data-cmd="fullscreen"]').removeClass('active');
			}
		});
		
		// Command buttons
		$toolbar.find('[data-cmd]').on('click', function(e) {
			e.preventDefault();
			var cmd = $(this).data('cmd');
			
			// Custom fullscreen for entire editor
			if (cmd === 'fullscreen') {
				toggleFullscreen();
				$(this).toggleClass('active', isFullscreen);
				return;
			}
			
			// Toggle commands
			if (cmd === 'sw-visibility') {
				var isActive = $(this).hasClass('active');
				if (isActive) {
					editor.stopCommand(cmd);
					$(this).removeClass('active');
				} else {
					editor.runCommand(cmd);
					$(this).addClass('active');
				}
			} else {
				// One-time commands
				editor.runCommand(cmd);
			}
		});
		
		// Update device info when device changes
		editor.on('change:device', function() {
			var device = editor.getDevice();
			$deviceInfo.text(device);
			$toolbar.find('[data-device]').removeClass('active');
			$toolbar.find('[data-device="' + device + '"]').addClass('active');
		});
		
		// Run visibility command on load
		editor.on('load', function() {
			editor.runCommand('sw-visibility');
		});
		
		// Prevent Enter key from submitting WordPress form, but let GrapesJS handle it
		$wrap.on('keypress keydown keyup', 'input:not([type="submit"]), select', function(e) {
			if (e.key === 'Enter' || e.keyCode === 13) {
				e.stopPropagation();				
				// Prevent form submission on keypress
				if (e.type === 'keypress') {
					e.preventDefault();
					return false;
				}
			}
		});
		
		// Also prevent form submission if Enter pressed in editor area
		$wrap.closest('form').on('keypress', function(e) {
			if ((e.key === 'Enter' || e.keyCode === 13) && $(e.target).closest('.acf-grapesjs-wrap').length) {
				e.preventDefault();
				return false;
			}
		});

		// Tab switching
		$wrap.find('.gjs-tab-btn').on('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			var tab = $(this).data('tab');
			$wrap.find('.gjs-tab-btn').removeClass('active');
			$(this).addClass('active');
			$wrap.find('.gjs-tab-content').hide();
			$wrap.find('#' + editorId + '-' + tab).show();
			return false;
		});

		// Sync content to textarea on changes
		function syncContent() {
			var html = editor.getHtml();
			var css = editor.getCss();
			var customCss = $customCssTextarea.val() || '';
			// Save as JSON to properly preserve HTML, CSS, and custom CSS separately
			var data = JSON.stringify({
				html: html,
				css: css,
				customCss: customCss
			});
			$storage.val(data);
		}
		
		// Apply custom CSS to canvas
		function applyCustomCss() {
			var customCss = $customCssTextarea.val() || '';
			var canvasDoc = editor.Canvas.getDocument();
			if (canvasDoc) {
				var styleId = 'gjs-custom-css';
				var existingStyle = canvasDoc.getElementById(styleId);
				if (existingStyle) {
					existingStyle.innerHTML = customCss;
				} else {
					var styleEl = canvasDoc.createElement('style');
					styleEl.id = styleId;
					styleEl.innerHTML = customCss;
					canvasDoc.head.appendChild(styleEl);
				}
			}
			syncContent();
		}
		
		// Listen for custom CSS changes
		$customCssTextarea.on('input', function() {
			applyCustomCss();
		});
		
		// Apply initial custom CSS after editor loads
		editor.on('load', function() {
			applyCustomCss();
		});

		editor.on('update', syncContent);
		editor.on('component:update', syncContent);
		editor.on('component:add', syncContent);
		editor.on('component:remove', syncContent);

		// Store editor instance
		editors[editorId] = editor;

		console.log('GrapesJS Visual Editor initialized:', editorId);
	}

	function destroy_field($field) {
		var $wrap = $field.find('.acf-grapesjs-wrap');
		var $editorContainer = $wrap.find('.gjs-editor');
		var editorId = $editorContainer.attr('id');
		
		if (editorId && editors[editorId]) {
			editors[editorId].destroy();
			delete editors[editorId];
		}
	}

	if (typeof acf.add_action !== 'undefined') {
		acf.add_action('ready_field/type=visual_editor', initialize_field);
		acf.add_action('append_field/type=visual_editor', initialize_field);
		acf.add_action('remove_field/type=visual_editor', destroy_field);
	}
})(jQuery);
